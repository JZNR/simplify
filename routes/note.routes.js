const router = require("express").Router();
const Note = require("../models/Event.model");
const User = require("../models/User.model");
const fileUpload = require("../config/cloudinary");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// Get all notes

router.get("/notes", isAuthenticated, async (req, res) => {
  try {
    if (!req.payload._id) {
      res.status(400).json({ message: "User not found" });
    }

    let currentUserPopulated = await User.findById(req.payload._id).populate(
      "notes"
    );
    const response = currentUserPopulated.notes;

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// Notes create

router.post("/notes/create", isAuthenticated, async (req, res) => {
    try {
      console.log(req.body);
  
      const { title, description } = req.body;
  
      if (!title || !description) {
        res.status(400).json({ message: "Missing Fields" });
      }
  
      const createdNote = await Note.create({
        title,
        description
      });
  
      const response = await User.findByIdAndUpdate(
        req.payload._id,
        {
          $push: {
            notes: createdNote._id,
          },
        },
        {
          new: true,
        }
      );
  
      res.status(200).json(response);
    } catch (e) {
      res.status(500).json({ message: e });
    }
  });

module.exports = router;
