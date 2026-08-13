import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 300 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
