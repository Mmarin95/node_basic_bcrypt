const express = require("express");
const app = express();

const bcrypt = require("bcrypt");

app.use(express.json());

let users = [];

app.get("/users", (req, res) => {
  res.status(200).send(users);
});

app.post("/users", async (req, res) => {
  const password = req.body.password;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = {
      username: req.body.username,
      password: hashPassword,
    };
    users.push(user);
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
});

app.post("/users/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = users.find((user) => user.username === username);
  if (user == null) return res.status(400).send("User not found.");

  try {
    const isRightPassword = await bcrypt.compare(password, user.password);

    if (isRightPassword) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } catch {
    res.sendStatus(500);
  }
});

app.listen(3000);
