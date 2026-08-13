import mongoose from "mongoose";
import { ORDER_STATUS_VALUES } from "../constants/order.js";

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1, max: 99 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customer: {
      name: { type: String, required: true, trim: true, maxlength: 80 },
      address: { type: String, required: true, trim: true, maxlength: 300 },
      phone: { type: String, required: true, trim: true },
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [(items) => items.length > 0, "At least one item is required"],
    },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ORDER_STATUS_VALUES,
      default: "Order Received",
    },
    statusHistory: [
      {
        status: { type: String, enum: ORDER_STATUS_VALUES },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

orderSchema.index({ createdAt: -1 });
export const Order = mongoose.model("Order", orderSchema);
