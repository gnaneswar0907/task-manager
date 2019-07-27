const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.get("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  try {
    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  const validUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every(update => validUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid Update Perfomred" });
  }
  try {
    const modifiedTask = await Task.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true
    });

    if (!modifiedTask) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(200).send(modifiedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id });
    if (!task) {
      return res.status(404).send({ error: "Task not found to delete" });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
