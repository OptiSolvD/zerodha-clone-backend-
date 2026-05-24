const mongoose = require("mongoose");

const { Schema } = mongoose;

const HoldingsSchema = new Schema({

  userId: {

    type: Schema.Types.ObjectId,

    ref: "User",

    required: true,

  },

  name: {

    type: String,

    required: true,

  },

  qty: {

    type: Number,

    required: true,

  },

  avg: {

    type: Number,

    required: true,

  },

});

const HoldingsModel =
  mongoose.model("Holding", HoldingsSchema);

module.exports = HoldingsModel;