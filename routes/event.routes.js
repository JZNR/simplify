const router = require("express").Router();
const { response } = require("express");
const { restart } = require("nodemon");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const fileUpload = require("../config/cloudinary");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

router.get("/event", isAuthenticated, async (req, res) => {
  try {
    // console.log("user", req.payload)
    if(!req.payload._id) {
      res.status(400).json({message: "User not found"})
    }

    let currentUserPopulated = await User.findById(req.payload._id).populate(
      "events"
    );
    // console.log("currentUserPopulated")
    // console.log("currentUserPopulated.event", currentUserPopulated.events);
    const response = currentUserPopulated.events;

    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// create events

router.post("/event",isAuthenticated, async (req, res) => {
  try {
    const { title, type, date } = req.body;
    if (!title || !date) {
      res.status(400).json({message: "Missing Fields"});
    }
    const createdEvent = await Event.create({ 
      title, 
      type: [type], 
      date, 
      user: req.payload ,
      start: "2023-02-21T08:00:00.000+00:00",
      end: "2023-02-21T10:30:00.000+00:00"
    });
   
    const response = await User.findByIdAndUpdate(
      req.payload._id,
      {
        $push: {
          events: createdEvent._id,
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

// Update Events Time - Drag & Drop

router.post("/event/update", isAuthenticated, async (req, res) => {
  try {
    console.log(req.body)
    const { eventTime, eventID } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventID, 
      {
        start: eventTime.start,
        end: eventTime.end
      }
    )
   console.log("updatedEvent", updatedEvent)
    res.status(200).json(updatedEvent);
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: e });
  }
});

module.exports = router;
