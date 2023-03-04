const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema({
  title: String,
  date: Date,
  start: Date,
  end: Date,
  allDay: Boolean,
  description: String,
  color: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Event", eventSchema);
