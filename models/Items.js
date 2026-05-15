const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  location: String,
  contact: String
});

module.exports = mongoose.model("Item", itemSchema);
