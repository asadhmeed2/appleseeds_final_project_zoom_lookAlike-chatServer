const mongoose = require("mongoose");
const UserSchema = mongoose.Schema;

const userModule = new UserSchema({
  userName: {
      type: "string",
      required: true,
      min:6
  },
  email: {
    type: String,
    // match: "",
    required: true,
  },
  password: {
    type: String,
    required: true,
    min:8
  },
  refreshToken: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("zoomusers", userModule);
