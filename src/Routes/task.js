const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

//GET TASK BY ID
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET ALL TASKS
router.get("/tasks", auth, async (req, res) => {
  try {
    await req.user.populate("tasks").execPopulate();
    res.status(200).send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

//CREATE TASK
router.post("/tasks", auth, async (req, res) => {
  const newTask = new Task({ ...req.body, owner: req.user._id });
  try {
    await newTask.save();
    res.status(201).send(newTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

//UPDATE TASK
router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const validUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every(update => validUpdates.includes(update));
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid Update Perfomred" });
  }
  try {
    const modifiedTask = await Task.findOne({ _id, owner: req.user._id });
    if (!modifiedTask) {
      return res.status(404).send({ error: "Task not found" });
    }

    updates.forEach(update => (modifiedTask[update] = req.body[update]));

    await modifiedTask.save();

    res.status(200).send(modifiedTask);
  } catch (error) {
    res.status(400).send(error);
  }
});

//DELETE ALL TASKS
router.delete("/tasks", auth, async (req, res) => {
  try {
    await Task.deleteMany({ owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "Tasks not found to deleted" });
    }
    res.status(200).send({ message: "All Tasks Deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
});

//DELETE TASK
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send({ error: "Task not found to delete" });
    }
    res.status(200).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
