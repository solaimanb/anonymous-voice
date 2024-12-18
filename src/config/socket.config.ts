import { io, Socket } from "socket.io-client";

export const createSocketConnection = (
  token: string,
  userData: { username: string; userId: string },
): Socket => {
  return io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    auth: {
      token,
      username: userData.username,
      userId: userData.userId,
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
};

export const socketEvents = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  PRIVATE_MESSAGE: "private:message",
  JOIN_ROOM: "room:join",
  LEAVE_ROOM: "room:leave",
  TYPING: "user:typing",
  PRESENCE: "user:presence",
};
