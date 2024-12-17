// import { io, Socket } from "socket.io-client";

// export const createSocketConnection = (
//   token: string,
//   userData: { username: string; userId: string },
// ): Socket => {
//   return io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
//     auth: {
//       token,
//       username: userData.username,
//       userId: userData.userId,
//     },
//     transports: ["websocket", "polling"],
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
//   });
// };

// export const socketEvents = {
//   CONNECT: "connect",
//   DISCONNECT: "disconnect",
//   PRIVATE_MESSAGE: "private:message",
//   JOIN_ROOM: "room:join",
//   LEAVE_ROOM: "room:leave",
//   TYPING: "user:typing",
//   PRESENCE: "user:presence",
// };

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
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 2000,
    timeout: 10000,
  });
};

export const socketEvents = {
  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",

  // Message events
  MESSAGE_SEND: "message:send",
  MESSAGE_RECEIVE: "message:receive",
  MESSAGE_STATUS: "message:status",

  // Chat room events
  ROOM_JOIN: "room:join",
  ROOM_LEAVE: "room:leave",

  // User events
  USER_TYPING: "user:typing",
  USER_PRESENCE: "user:presence",
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",
};
