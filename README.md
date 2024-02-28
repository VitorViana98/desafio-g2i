# News backend service
## Introduction
Your task will be to implement a simple HTTP Server in NodeJS using vanilla JS (no framework).
## Setup for local environment
Follow the below steps if you are using .zip/git mode (i.e., not available inside DevSkiller’s in-browser IDE):
1. `npm install` – install dependencies.
2. `npm test` – run all tests once (this will be used to evaluate your solutions).
3. `npm run test:watch` - run all tests in the _watch mode_ (optionally, you can use it locally if you prefer).
## Task
 
You are supposed to implement an HTTP server for managing news. The server will share a Rest API through which it will be possible to:
1. Handle authentication (`src/auth/handlers.js`):
 * log in,
 * log out.
2. Handle news items (`src/news/handlers.js`):
 * fetch all news (public access),
 * add a news item (logging in is required),
 * edit a news item (logging in is required),
 * delete a news item (logging in is required).
3. Also, the server configuration in `src/server.js` has to be implemented.
 
## Requirements
 
Do NOT modify the functions marked with the "Do not modify" comment.
 
**Meet ALL the below requirements** and make sure the unit tests pass.
 
### Server
 
Server endpoints are predefined for you in the `src/routes.js`. Each route is an object, like this:
```json
{
 "urlMatcher": /\/news/, // the regular expression for matching the route.
 "method": 'GET', // tells which HTTP request method the route should respond to.
 "handler": readNews, // the function to call for handling that request.
}
```
 
Your server is defined in the `src/server.js` file. Implement the `requestListener()` method, so that:
* handler functions of respective routes get called (e.g., for the `HTTP GET /news` request, the `news:readNews` handler function is called),
* the server sends an empty response with `404` code in case no routes were matched,
* all responses should have the `Content-Type` set to `application/json`.
 
### Handling news items
 
Implement handler functions defined in the `src/news/handlers.js`. News should be stored in the `news` variable defined in the `/src/news/handlers.js` module.
 
An example news item has the following structure:
```json
{
 "id": generateId(), // to generate IDs use `v4` from the `uuid` library, which has already been imported as `generateId()` for your convenience.
 "author": "author1",
 "title": "Shocking development in the trial!",
 "text": "Trial has been dismissed.",
}
```
 
`readNews()` handler
* Should send a json response (feel free to use a utility function `sendJsonResponse()`) containing an array of all news.
`addNews()` handler
* Should add a news item if the user provides a valid token along the news data; return an empty response with `201` code.
* Should send an empty response with `403` code in case the user does not provide a valid token (see Authentication below).
 
`editNews()` handler
* Should edit some news items with a certain ID if the user provides a valid token along the news data; return an empty response with `200` code.
* Should send an empty response with `403` code in case the user does not provide a valid token (see Authentication below).
 
`deleteNews()` handler
* Should delete some news items with a certain ID if the user provides a valid token along the news data; return an empty response with `200` code.
* Should send an empty response with `403` code in case the user does not provide a valid token (see Authentication below).
 
You can use the `readBody()` function from the `src/utils/read-body.js` for reading the bodies of HTTP requests.
When editing/deleting news items, the order of the news items returned by the `readNews()` can be changed.
 
### Authentication
 
You need to make sure that only the logged in users are able to modify the content (add/edit/delete news items) on the server.
Implement the `login()` and `logout()` methods in the `src/auth/handlers.js` to implement authentication.
When a user passes a proper username and password to the `/auth/login` endpoint, it should return an object containing a token, which will be used in subsequent requests for authentication.
 
Example:
A user sends an `HTTP POST /auth/login` request with the following body:
```json
{
 "username": "author1", // a valid user.
 "password": "password1" // a valid password.
}
```
  
The server should respond with `200` code and the following object:
```json
{
 "token": "e4552522-e1ee-4c5f-834d-2390e3f09cc5"
}
```
 
* The auth token is generated using the [`uuid` npm package](https://www.npmjs.com/package/uuid), already imported as the `generateToken()` method for your convenience.
* If wrong credentials are passed; the server needs to return `403` code with an empty response.
 
You will find two users’ credentials in the `src/auth/users.js` file. Passwords are hashed with the `sha1` function from the `sha1` library.
 
Do NOT modify the below files:
* `src/auth/users.js`
* `src/news/preexisting-news.js`
 
### Good Luck!
