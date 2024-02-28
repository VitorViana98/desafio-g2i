const http = require("http");
const { readNews, addNews, editNews, deleteNews } = require("./news/handlers");
const { login, logout } = require("./auth/handlers");

function createServer() {
  return http.createServer(requestListener);
}

function requestListener(req, res) {
  res.setHeader("Content-Type", "application/json");
  let requestBody = '';

  req.on('data', (chunk) => {
    requestBody += chunk;
  });

  req.on('end', () => {
    try {
      req.body = JSON.parse(requestBody);
    } catch (error) {
      console.error('Error parsing request body:', error);
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid JSON in request body' }));
      return;
    }

    const routes = [
      { urlMatcher: /\news/, method: "GET", handler: readNews },
      { urlMatcher: /\news/, method: "POST", handler: addNews },
      { urlMatcher: /\news\/(\w+)/, method: "PUT", handler: editNews },
      { urlMatcher: /\news\/(\w+)/, method: "DELETE", handler: deleteNews },
      { urlMatcher: /\/auth\/login/, method: 'POST', handler: login },
      { urlMatcher: /\/auth\/logout/, method: 'POST', handler: logout },
    ];

    const matchingRoute = routes.find((route) => {
      const methodMatches = req.method === route.method;
      const urlMatches = route.urlMatcher.test(req.url);
      return methodMatches && urlMatches;
    });

    if (matchingRoute) {
      matchingRoute.handler(
        req,
        res,
        extractParams(req.url, matchingRoute.urlMatcher)
      );
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: "Route not found" }));
    }
  });
}

function extractParams(url, matcher) {
  const matches = url.match(matcher);
  return matches ? matches.slice(1) : [];
}

module.exports = {
  createServer,
};
