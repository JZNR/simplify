const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema({
  title: String,
  type: [
    {
      enum: ["event", "task", "meeting", "reminder"],
      type: String,
    },
  ],
  date: Date,
  start: Date,
  end: Date,
  allDay: Boolean,
  description: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Event", eventSchema);
