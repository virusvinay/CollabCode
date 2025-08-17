import { io } from "socket.io-client";

export const initSocket = async () => {
  const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const socket = io(backendURL, {
    forceNew: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    timeout: 20000,
    transports: ["websocket", "polling"],
    path: "/socket.io",
    withCredentials: false,
  });

  return socket;
};
