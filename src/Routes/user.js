const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/users/:id", async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const validUpdates = ["name", "age", "password", "email"];
  const isValidUpdate = updates.every(update => validUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update performed" });
  }
  try {
    const user = await User.findOne({ _id });

    updates.forEach(update => (user[update] = req.body[update]));

    await user.save();

    if (!user) {
      return res.status(404).send("User not found with given id");
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findOneAndDelete({ _id });
    if (!user) {
      return res.status(404).send({ error: "User not found to delete" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
