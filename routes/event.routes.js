const router = require("express").Router();
const { response } = require("express");
const { restart } = require("nodemon");
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const fileUpload = require("../config/cloudinary");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// Get all events

router.get("/event", isAuthenticated, async (req, res) => {
  try {
    // console.log("user", req.payload)
    if (!req.payload._id) {
      res.status(400).json({ message: "User not found" });
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

// Get One Event

router.get("/event/:eventID", async (req, res) => {
  try {
    const response = await Event.findById(req.params.eventID);
    res.status(200).json(response);
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

// Create events

router.post("/event", isAuthenticated, async (req, res) => {
  try {
    console.log(req.body);

    const { title, type, date, allDay, startTime, endTime } = req.body;

    const start = date + `T${startTime}:00`;
    const end = date + `T${endTime}:00`;

    if (!title || !date) {
      res.status(400).json({ message: "Missing Fields" });
    }

    const createdEvent = await Event.create({
      title,
      type: [type],
      date,
      allDay,
      user: req.payload,
      start: start,
      end: end,
      // start: "2023-02-21T08:00:00.000+00:00",
      // end: "2023-02-21T10:30:00.000+00:00"
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
    console.log(req.body);
    const { eventTime, eventID } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventID, {
      start: eventTime.start,
      end: eventTime.end,
    });
    console.log("updatedEvent", updatedEvent);
    res.status(200).json(updatedEvent);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
});

// Update events - Not Drag & Drop

router.post("/event/edit", isAuthenticated, async (req, res) => {
  try {

    const { title, type, date, allDay, description, eventID} = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(
      eventID,
      {
        title,
        type,
        date,
        description,
        allDay,
      },
      {
        // the response will have the updated information
        new: true,
      }
    );
    console.log("updatedEvent", updatedEvent);
    res.status(200).json(updatedEvent);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
});

// Delete Events

router.post("/event/delete", async (req, res) => {
  try {
    const { eventID } = req.body;
    await Event.findByIdAndDelete(eventID);
    res.status(200).json({ message: `Project with id ${eventID} was deleted` });
  } catch (e) {
    res.status(500).json({ message: e });
  }
});

module.exports = router;
