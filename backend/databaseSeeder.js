const router = require("express").Router();

const products = require("./data/products");
const users = require("./data/users");
const Product = require("./models/Product");
const User = require("./models/User");
const AsyncHandler = require("express-async-handler");

router.post(
  "/users",
  AsyncHandler(async (req, res) => {
    await User.deleteMany({});
    const userSeeder = await User.insertMany(users);
    res.json({ userSeeder });
  })
);
router.post(
  "/products",
  AsyncHandler(async (req, res) => {
    await Product.deleteMany({});
    const productsSeeder = await Product.insertMany(products);
    res.json({ productsSeeder });
  })
);

module.exports = router;
