const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("user", {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email must be in correct format");
      }
    },
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (validator.contains(value.toLowerCase(), "password")) {
        throw new Error("Password should not contain password phrase");
      }
    }
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive");
      }
    },
    default: 0
  }
});

module.exports = User;
