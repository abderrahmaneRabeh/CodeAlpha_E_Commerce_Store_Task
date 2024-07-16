const express = require("express");
const orderRouter = express.Router();
const protected = require("../middleware/Auth");
const Order = require("../models/Order");
const AsyncHandler = require("express-async-handler");

orderRouter.post(
  "/",
  protected,
  AsyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethods,
      shippingPrice,
      taxPrice,
      totalPrice,
      price,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethods,
        shippingPrice,
        taxPrice,
        totalPrice,
        price,
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  })
);

orderRouter.put(
  "/:id/pay",
  protected,
  AsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
);

orderRouter.get(
  "/",
  protected,
  AsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    if (orders) {
      res.json(orders);
    } else {
      res.status(404);
      throw new Error("Orders not found");
    }
  })
);

orderRouter.get(
  "/:id",
  protected,
  AsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "email");
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  })
);

module.exports = orderRouter;
