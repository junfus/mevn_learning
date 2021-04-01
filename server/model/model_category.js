const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  unit: { type: String, required: true, trim: true },
  out: { type: Boolean, default: true },
  comments: { type: String, trim: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("category", categorySchema, "category");
