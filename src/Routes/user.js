const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeMail, sendLeavingMail } = require("../emails/account");

// Sign up Route
router.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    const token = await newUser.getAuthToken();
    sendWelcomeMail(newUser.email, newUser.name);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login Route
router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.getAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//Logout USER
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.status(200).send({ message: "logged out successfully" });
  } catch (error) {
    res.status(500).send({ message: "log out unsuccessful" });
  }
});

//Logout All Sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res
      .status(200)
      .send({ message: "logged out from All devices successfully" });
  } catch (error) {
    res.status(500).send({ message: "log out unsuccessful" });
  }
});

//GET USER PROFILE
router.get("/users", auth, async (req, res) => {
  res.send(req.user);
});

//UPDATE USER BY ID
router.patch("/users", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const validUpdates = ["name", "age", "password", "email"];
  const isValidUpdate = updates.every(update => validUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid update performed" });
  }
  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

//DELETE USER BY ID
router.delete("/users", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendLeavingMail(req.user.email, req.user.name);
    res.status(200).send({ message: "user deleted" });
  } catch (error) {
    res.status(500).send(error);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  }
});

//Uploading Profile Images
router.post(
  "/users/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .png()
      .resize(250, 250)
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

module.exports = router;
