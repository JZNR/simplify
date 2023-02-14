const mongoose = require("mongoose");
const { Schema, model } = mongoose; 

const taskSchema = new Schema ({
  title: String,
  type: [ 
    { 
      enum: [ "event", "task", "meeting", "reminder" ], 
      type: String, 
      }
    ],
  date: Date,
  user:  { type: Schema.Types.ObjectId, ref: "User" }
})

module.exports = model("Task", taskSchema);