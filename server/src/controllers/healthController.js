import mongoose from "mongoose";

const DATABASE_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

export const getHealth = (req, res) => {
  const databaseStatus =
    DATABASE_STATES[mongoose.connection.readyState] || "unknown";
  const healthy = databaseStatus === "connected";

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "unavailable",
    service: "quickbite-api",
    database: databaseStatus,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};
