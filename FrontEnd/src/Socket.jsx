import { io } from "socket.io-client";

export const initSocket = async () => {
  // Use VITE_BACKEND_URL from .env, fallback to localhost for dev
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  return io(backendURL, options);
};
