const {readNews, addNews, editNews, deleteNews} = require("./news/handlers");
const {login, logout} = require("./auth/handlers");

// DO NOT MODIFY THIS FILE
const specificNewsUrlMatcher = /\/news\/(?<id>\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/; // example: '/news/d4552522-e9ee-4c2f-834d-2390e3f09cc4'
const routes = [
    {
        urlMatcher: /\/news/,
        method: 'GET',
        handler: readNews,
    },
    {
        urlMatcher: /\/news/,
        method: 'POST',
        handler: addNews,
    },
    {
        urlMatcher: specificNewsUrlMatcher,
        method: 'PUT',
        handler: editNews,
    },
    {
        urlMatcher: specificNewsUrlMatcher,
        method: 'DELETE',
        handler: deleteNews,
    },
    {
        urlMatcher: /\/auth\/login/,
        method: 'POST',
        handler: login,
    },
    {
        urlMatcher: /\/auth\/logout/,
        method: 'POST',
        handler: logout,
    },
]

module.exports = {
    routes,
}
