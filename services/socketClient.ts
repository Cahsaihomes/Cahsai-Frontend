import { io as Client, Socket } from "socket.io-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://cahsai-backend-production.up.railway.app";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = Client(SERVER_URL, { transports: ["websocket"] });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
