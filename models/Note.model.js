const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const noteSchema = new Schema({
  title: String,
  date: Date,
  description: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Note", noteSchema);
