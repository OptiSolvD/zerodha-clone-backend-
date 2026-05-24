   const mongoose = require("mongoose");
   
   const { Schema } = mongoose;
   
    
    const UsersSchema = new Schema({
      
    
      username: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
      
      },
    
      password: {
        type: String,
        required: true,
      },
    
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });
    

const UsersModel =
  mongoose.model(
    "User",
    UsersSchema
  );

module.exports = {UsersModel};
