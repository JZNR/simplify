const router = require("express").Router();
const { response } = require("express");
const { restart } = require("nodemon");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const fileUpload = require("../config/cloudinary");

router.get("/event", async (req, res) => {
  try {
    const response = await Event.find();
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// create events

router.post("/event", async (req, res) => {
  try {
    const { title, type, date } = req.body;
    if (!title || !date) {
      res.status(400).json({message: "Missing Fields"});
    }
    const response = await Event.create({ title, type: [type], date });
    console.log(response)
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

module.exports = router;
