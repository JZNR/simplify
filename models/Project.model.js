const { Schema, model} = require("mongoose");

const projectSchema = new Schema({
    title: String,
    description: String,
    imageUrl: String,
    tasks:  [{ type: Schema.Types.ObjectId, ref: "Task" }]
});

// Translates in a projects collection on mongodb
const Project = model("Project", projectSchema);

module.exports =Project