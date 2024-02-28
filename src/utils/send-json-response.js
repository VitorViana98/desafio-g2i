function sendJsonResponse(res, status, response = {}) {
    res.writeHead(status);
    res.end(JSON.stringify(response));
}

module.exports = {
    sendJsonResponse,
}
