import http from "http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { verifyToken } from "./utils/token.js";
import { User } from "./models/User.js";
import { Order } from "./models/Order.js";

const app = createApp();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: env.clientOrigin } });
app.set("io", io);
io.use(async (socket, next) => {
  try {
    const payload = verifyToken(socket.handshake.auth?.token);
    if (payload.role === "restaurant") {
      socket.role = "restaurant";
      return next();
    }
    const user = await User.findById(payload.sub);
    if (!user) return next(new Error("Authentication required"));
    socket.userId = user.id;
    next();
  } catch {
    next(new Error("Authentication required"));
  }
});
io.on("connection", (socket) => {
  if (socket.role === "restaurant") {
    socket.join("restaurant:orders");
    return;
  }
  socket.join(`user:${socket.userId}`);
  socket.on("order:subscribe", async (id) => {
    if (
      typeof id === "string" &&
      (await Order.exists({ _id: id, user: socket.userId }))
    )
      socket.join(`order:${id}`);
  });
});
if (!env.jwtSecret) throw new Error("JWT_SECRET is required");
if (!env.restaurantAccessKey)
  throw new Error("RESTAURANT_ACCESS_KEY is required");
await connectDatabase(env.mongoUri);
server.listen(env.port, () =>
  console.log(`QuickBite API listening on ${env.port}`),
);
const shutdown = () => server.close(() => process.exit(0));
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
