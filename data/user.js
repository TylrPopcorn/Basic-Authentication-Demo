//MONGOOSE DATABASE
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // specifies that each document (user) will have a username and password field,
  username: {
    type: String,
    required: [true, "Username cannot be blank"], // Required, with custom error messages if they’re not provided
  },
  password: {
    type: String,
    required: [true, "Password cannot be blank"], // Required, with custom error messages if they’re not provided
  },
});

module.exports = mongoose.model("User", userSchema); //export schema
// exporting a Mongoose model named "User", which is based on the userSchema
