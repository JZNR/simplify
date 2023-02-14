const router = require("express").Router();
const { response } = require("express");
const { restart } = require("nodemon");
const Project = require("../models/Project.model")
const Task = require("../models/Task.model");
const fileUpload = require("../config/cloudinary")
// get requests

router.get("/projects", async (req, res) => {
    try {
        const response = await Project.find();
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e})
    }
});

// post requests

router.post("/projects", async (req, res) => {
    try {
        const {title, description, imageUrl} = req.body;
        if(!title || !description) {
            res.status(400).json({message: "missing fields"});
        }
        const response = await Project.create({title, description, imageUrl});
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({message: e})
    }
})

// delete requests - delete a project

router.delete("/project/:projectId", async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.projectId);
        res.status(200).json({message: `Project with id ${req.params.projectId} was deleted`})
        } catch (e) {
        res.status(500).json({message: e})
    }
})

// GET One Project

router.get("/project/:projectId", async (req, res) => {
    try {
            const response = await Project.findById(req.params.projectId);
            res.status(200).json(response);
        } catch (e) {
        res.status(500).json({message: e})
    }
})

// PUT PATCH

router.put("/project/:projectId", async (req, res) => {
    try {
            const { title, description } = req.body;
            const response = await Project.findByIdAndUpdate(req.params.projectId, {
                title,
                description
            }, {
                // the response will have the updated information
                new: true,
            });
            res.status(200).json(response);
        } catch (e) {
        res.status(500).json({message: e})
    }
})

// POST create tasks
// relationship beetween Collections

router.post("/task", async (req, res) => {
    try {
          const { title, description, project} = req.body;
          // 1. create Task
          const response = await Task.create({title, description, project})
          //   2. Update the project by pushing the task id to its task array
          const projectResponse = await Project.findByIdAndUpdate(
            project,
            { $push: {tasks: response._id}}, 
            {new: true} )
          res.status(200).json(projectResponse)
        } catch (e) {
        res.status(500).json({message: e})
    }
})

// Upload
router.post("/upload", fileUpload.single("filename"), async (req, res) => {
    try {
        res.status(200).json({fileUrl: req.file.path})
    } catch (error) {
        res
        .status(500)
        .json({message: "An error ocurred while returning the image path"})
    }
})
module.exports = router;