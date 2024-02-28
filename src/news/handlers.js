const { v4: generateId } = require("uuid");
const { readBody } = require("../utils/read-body.js");
let news = [];

function setNews(newNews) {
  // DO NOT MODIFY THIS FUNCTION
  news = newNews;
}

function readNews(req, res) {
  res.status(200).json(news);
}

function addNews(req, res) {
  const { token } = req.headers;

  if (!token) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const newsData = readBody(req);
  const newNewsItem = { id: generateId(), ...newsData };
  news.push(newNewsItem);

  res.status(201).send();
}

function editNews(req, res, { id }) {
  const { token } = req.headers;

  if (!token) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const newsData = readBody(req);
  const index = news.findIndex((item) => item.id === id);

  if (index !== -1) {
    news[index] = { ...news[index], ...newsData };
    res.status(204).send();
  } else {
    res.status(404).json({ error: "News not found" });
  }
}

function deleteNews(req, res, { id }) {
  const { token } = req.headers;

  if (!token) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }

  const index = news.findIndex((item) => item.id === id);

  if (index !== -1) {
    news.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: "News not found" });
  }
}

module.exports = {
  readNews,
  addNews,
  editNews,
  deleteNews,
  setNews,
};
