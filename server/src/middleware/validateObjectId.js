import mongoose from "mongoose";
import { HttpError } from "../utils/httpError.js";

export const validateObjectId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id)
    ? next()
    : next(new HttpError(400, "Invalid resource id"));
