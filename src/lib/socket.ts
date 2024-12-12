import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    username: "TestUser1",
  },
});

export default socket;
