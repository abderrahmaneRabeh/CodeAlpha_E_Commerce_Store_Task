const express = require("express");
const ProductRouter = express.Router();
const Product = require("../models/Product");
const AsyncHandler = require("express-async-handler");

ProductRouter.get(
  "/",
  AsyncHandler(async (req, res) => {
    const products = await Product.find();
    res.json(products);
  })
);

ProductRouter.get(
  "/:id",
  AsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send({ message: "product not found" });
    }
  })
);

module.exports = ProductRouter;
