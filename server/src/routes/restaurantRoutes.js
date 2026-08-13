import { Router } from "express";
import {
  listRestaurantOrders,
  loginRestaurant,
  patchRestaurantOrderStatus,
} from "../controllers/restaurantController.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { authenticateRestaurant } from "../middleware/authenticateRestaurant.js";

export const restaurantRoutes = Router();
restaurantRoutes.post("/login", loginRestaurant);
restaurantRoutes.use(authenticateRestaurant);
restaurantRoutes.get("/orders", listRestaurantOrders);
restaurantRoutes.patch(
  "/orders/:id/status",
  validateObjectId,
  patchRestaurantOrderStatus,
);
