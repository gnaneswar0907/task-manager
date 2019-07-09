const express = require("express");

require("./db/mongoose");
const User = require("./models/User");
const Task = require("./models/Task");

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      res.status(200).send(user);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.get("/users", (req, res) => {
  User.find({})
    .then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post("/users", (req, res) => {
  const newUser = new User(req.body);
  newUser
    .save()
    .then(() => {
      res.status(201).send(req.body);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

app.get("/tasks/:id", (req, res) => {
  const _id = req.params.id;
  Task.findById(_id)
    .then(task => {
      if (!task) {
        return res.status(404).send({ error: "Task not found" });
      }
      res.status(200).send(task);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.get("/tasks", (req, res) => {
  Task.find({})
    .then(tasks => {
      res.status(200).send(tasks);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post("/tasks", (req, res) => {
  const newTask = new Task(req.body);
  newTask
    .save()
    .then(() => {
      res.status(201).send(req.body);
    })
    .catch(error => {
      res.status(400).send(error);
    });
});

app.listen(port, () => {
  console.log("listening on port 3000");
});
