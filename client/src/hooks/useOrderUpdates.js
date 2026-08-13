import { useEffect } from "react";
import { io } from "socket.io-client";
import { TOKEN_KEY } from "../context/AuthContext.jsx";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8008";

export function useOrderUpdates(orderId, onUpdate) {
  useEffect(() => {
    if (!orderId) return undefined;

    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem(TOKEN_KEY) },
    });

    socket.emit("order:subscribe", orderId);
    socket.on("order:updated", onUpdate);

    return () => socket.disconnect();
  }, [orderId, onUpdate]);
}
