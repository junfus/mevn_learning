const mongoose = require("mongoose");

const recordSchema = mongoose.Schema({
  date: { type: Date, require: true },
  category: { type: mongoose.ObjectId, require: true },
  numbers: { type: Number, require: true },
  comments: { type: String, trim: true },
  created: { type: Date, default: Date.now },
  deletionFlag: { type: Boolean, default: false },
});

module.exports = mongoose.model("record", recordSchema, "record");
