"use client";

import { useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { AuthService } from "@/services/auth.service";
import { useChatStore } from "@/store/useChatStore";
import { ChatMessage, ChatUser } from "@/types/chat.types";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export default function ChatPage() {
  const currentActiveUser = AuthService.getStoredUser();
  const {
    activeUser,
    onlineUsers,
    addMessage,
    setOnlineUsers,
    setActiveUser,
    getMessagesForRoom,
  } = useChatStore();

  const currentUser = {
    username: currentActiveUser?.userName,
    id: currentActiveUser?.id,
  };

  useEffect(() => {
    if (!currentUser.username) return;

    const socket: Socket = io(SOCKET_URL, {
      auth: { username: currentUser.username },
    });

    socket.on("users", (users: ChatUser[]) => {
      setOnlineUsers(users.map((user) => user.username));
    });

    socket.on("private message", (data: ChatMessage) => {
      const roomId = [data.senderId, currentUser.id].sort().join("-");
      addMessage(roomId, {
        ...data,
        timestamp: Date.now(),
        status: "delivered",
      });
    });

    socket.on("message sent", (data: { to: string }) => {
      console.log("Message delivered to:", data.to);
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUser.username, addMessage, setOnlineUsers, currentUser.id]);

  const handleUserSelect = (user: ChatUser) => {
    const roomId = [currentUser.id, user.id].sort().join("-");
    setActiveUser(user);
    const roomMessages = getMessagesForRoom(roomId);
    console.log("Room messages:", roomMessages);
  };

  // const handleSendMessage = (content: string) => {
  //   if (!activeUser || !content.trim()) return;

  //   const roomId = [currentUser.id, activeUser.id].sort().join("-");
  //   const message: ChatMessage = {
  //     id: crypto.randomUUID(),
  //     content: content.trim(),
  //     senderId: currentUser.id!,
  //     timestamp: Date.now(),
  //     status: "sent",
  //     from: currentUser.id!,
  //     fromUsername: currentUser.username!,
  //     message: content.trim(),
  //     roomId,
  //   };

  //   addMessage(roomId, message);
  // };

  if (!currentUser.username) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Online Users</h2>
          <div className="mt-4 space-y-2">
            {onlineUsers
              .filter((username) => username !== currentUser.username)
              .map((username) => (
                <button
                  key={username}
                  onClick={() => handleUserSelect({ username } as ChatUser)}
                  className="w-full p-2 text-left hover:bg-muted rounded-lg"
                >
                  {username}
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="flex-1">
        {activeUser ? (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h3 className="font-semibold">{activeUser.username}</h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {/* Messages list component */}
            </div>
            <div className="p-4 border-t">{/* Message input component */}</div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
