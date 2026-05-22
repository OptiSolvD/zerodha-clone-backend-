const  {Schema}= require("mongoose");
const bcrypt = require("bcrypt");
const UsersSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports={UsersSchema};