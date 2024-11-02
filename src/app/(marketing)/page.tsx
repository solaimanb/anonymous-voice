// pages/index.js
"use client";
import { useEffect, useState } from "react";

import socket from "@/lib/socket";

const Home = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for messages from the server
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    const message = { text: "Hello from Next.js!" };
    socket.emit("message", message);
  };

  return (
    <div>
      <h1>Socket.IO with Next.js</h1>
      <button onClick={sendMessage}>Send Message</button>
      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
