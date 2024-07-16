// import packages
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const databaseSeeder = require("./databaseSeeder");
const User = require("./models/User");
const UserRouter = require("./routes/user");
const ProductRouter = require("./routes/Product");

const PORT = process.env.SERVER_PORT;
const URL = process.env.DB_URL;

const app = express();
app.use(express.json());
dotenv.config();

mongoose.connect(URL).then(() => {
  console.log("connect to cloud successfully");
});

// routes
app.use("/api/seed", databaseSeeder);

// user Routes
app.use("/api/user", UserRouter);

app.get("/", async (req, res) => {
  const usersList = await User.find();
  res.json({ usersList });
});
// Product Routes
app.use("/api/product", ProductRouter);

app.listen(PORT || 9000, () => {
  console.log("server listening on", PORT);
});
