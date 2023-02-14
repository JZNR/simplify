const router = require("express").Router();
const { response } = require("express");
const { restart } = require("nodemon");
const Event = require("../models/Event.model")
const User = require("../models/User.model");
const fileUpload = require("../config/cloudinary")

router.get("/calendar", async (req, res) => {
    try {
        const response = await Event.find();
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e})
    }
});

// create events

router.post("/calendar", async (req, res) => {
    try {
        const { title, type, date } = req.body;
        const response = await Event.create( { title, type: [type], date  });
        res.status(200).json(response);
    } catch(e) {
        res.status(500).json({message: e})
    }
});

module.exports = router;