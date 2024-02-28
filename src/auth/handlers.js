const { v4: generateToken } = require("uuid");
const sha1 = require("sha1");

let users = [];
let loggedInUsers = [];

function setUsers(newUsers) {
  // DO NOT MODIFY THIS FUNCTION
  loggedInUsers = [];
  users = newUsers;
}

function login(req, res) {
  console.log("aqui req.body", req.body);
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);

  if (user && sha1(password) === user.password) {
    const token = generateToken();
    loggedInUsers.push({ username, token });

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ token }));
  } else {
    res.writeHead(403, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid credentials" }));
  }
}

function logout(req, res) {
  const { token } = req.headers;

  loggedInUsers = loggedInUsers.filter((user) => user.token !== token);

  res.writeHead(204, { "Content-Type": "application/json" });
}

module.exports = {
  login,
  logout,
  setUsers,
};
