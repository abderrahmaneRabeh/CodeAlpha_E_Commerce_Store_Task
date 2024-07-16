const express = require("express");
const UserRouter = express.Router();
const protected = require("../middleware/Auth");
const User = require("../models/User");
const AsyncHandler = require("express-async-handler");
const generateToken = require("../tokenGenerate");

UserRouter.post(
  "/login",
  AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401).send({ message: "invalid email or password" });
    }
  })
);

UserRouter.post(
  "/register",
  AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).send({ message: "user already exists" });
    } else {
      const user = new User({ name, email, password });
      await user.save();
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    }
  })
);

UserRouter.get(
  "/profile",
  protected,
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).send({ message: "user not found" });
    }
  })
);

UserRouter.put(
  "/profile",
  protected,
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
        createdAt: updatedUser.createdAt,
      });
    } else {
      res.status(404).send({ message: "user not found" });
    }
  })
);

module.exports = UserRouter;
