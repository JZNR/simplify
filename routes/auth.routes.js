const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, surname } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      res.status(400).json({ message: "user already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      surname,
    });
    res.status(200).json(createdUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "missing fields" });
      return;
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(401).json({ message: "invalid login" });
      return;
    }

    const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);
    if (!isPasswordCorrect) {
      res.status(401).json({ message: "invalid login" });
      return;
    }

    const authToken = jwt.sign(
      {
        _id: foundUser._id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        surname: foundUser.surname,
        password: foundUser.password,
      },
      process.env.TOKEN_SECRET,
      { algorithm: "HS256", expiresIn: "6h" }
    );

    res.status(200).json(authToken);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/verify", isAuthenticated, (req, res) => {
  return res.status(200).json(req.payload);
});

router.get("/user/get", async (req, res) => {
  const { userId } = req.body;

  const response = await User.findById(userId);
  return res.status(200).json(response);
});

router.post("/user/edit", isAuthenticated, async (req, res) => {
  try {
    const { username, email, oldPassword, newPassword, confirmedNewPassword } =
      req.body;
    const userID = req.user._id;
    let passwordHash = "";
    const updateUser = {};

    if (username) {
      updateUser.username = username;
    }
    if (email) {
      updateUser.email = email;
    }

    if (req.file) {
      updateUser.picture_url = req.file.path;
    }

    if (oldPassword && newPassword && confirmedNewPassword) {
      if (newPassword === confirmedNewPassword) {
        try {
          // const passwordHash = newPassword;

          if (bcrypt.compareSync(oldPassword, req.user.passwordHash)) {
            const salt = await bcrypt.genSalt(saltRounds);
            passwordHash = await bcrypt.hash(newPassword, salt);
          }
        } catch (error) {}
      } else {
      }
    }
    if (passwordHash) {
      updateUser.passwordHash = passwordHash;
    }
    const user = await User.findByIdAndUpdate(userID, updateUser);
    req.user = user;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
