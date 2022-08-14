import moment from "moment";
import MilkCapacity from "../models/milkCapacityModel.js";
import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

const addOrder = asyncHandler(async (req, res) => {
  const { milkQuantity, shippingAddress } = req.body;

  const milkCapacity = await MilkCapacity.findById(
    moment(Date.now()).format("MMDDYYYY")
  );

  if (milkCapacity) {
    if (milkCapacity.milkCapacityDay < milkQuantity) {
      res.status(400).json("Milk Capacity reached for the day!!");
      throw new Error("Milk Capacity reached for the day!!");
    }

    milkCapacity.milkCapacityDay = milkCapacity.milkCapacityDay - milkQuantity;

    const updatedMilkCapacity = await milkCapacity.save();
  } else {
    const milkCapacity = new MilkCapacity({
      _id: moment(Date.now()).format("MMDDYYYY"),
      milkCapacityDay: process.env.MAX_CAPACITY - milkQuantity,
    });
    const handler = await milkCapacity.save();
  }

  const order = new Order({
    milkQuantity,
    shippingAddress,
  });

  const createdOrder = await order.save();

  res.status(201).json(createdOrder);
});

const updateOrder = asyncHandler(async (req, res) => {
  const { milkQuantity, shippingAddress } = req.body;

  const order = await Order.findById(req.params.id);

  const milkCapacity = await MilkCapacity.findById(
    moment(order.createdAt).format("MMDDYYYY")
  );

  if (order) {
    if (
      Math.abs(milkCapacity.milkCapacityDay - order.milkQuantity) < milkQuantity
    ) {
      res.status(400).json("Milk Capacity reached for the day!!");
      throw new Error("Milk Capacity reached for the day!!");
    }

    milkCapacity.milkCapacityDay = Math.abs(
      milkCapacity.milkCapacityDay + order.milkQuantity - milkQuantity
    );

    const updatedMilkCapacity = await milkCapacity.save();

    order.milkQuantity = milkQuantity;
    order.shippingAddress = shippingAddress;

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  console.log(moment(order.createdAt).format("MMDDYYYY"));
  const milkCapacity = await MilkCapacity.findById(
    moment(order.createdAt).format("MMDDYYYY")
  );

  if (order) {
    milkCapacity.milkCapacityDay =
      milkCapacity.milkCapacityDay + order.milkQuantity;
    await milkCapacity.save();
    await order.deleteOne();
    res.status(200).json({ message: "The order was deleted" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    if (orderStatus === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    order.orderStatus = orderStatus;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

const checkCapacity = asyncHandler(async (req, res) => {
  const milkCapacity = await MilkCapacity.findById(
    moment(req.params.date).format("MMDDYYYY")
  );

  if (milkCapacity) {
    res.status(200).json({ milkCapacity: milkCapacity.milkCapacityDay });
  } else {
    res.status(404);
    throw new Error("No Orders placed for the given day.!!");
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({});

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404);
    throw new Error("No Orders placed for the given day.!!");
  }
});

export {
  addOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  checkCapacity,
  getAllOrders,
};
