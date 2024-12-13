import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import { socketService } from "@/services/socket.service";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/types/chat.types";

export function useChat(roomId: string) {
  const { user } = useAuth();
  const { messages, addMessage, updateMessageStatus, activeUser } =
    useChatStore();

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket || !roomId) return;

    socket.emit("join_room", roomId);

    const handleNewMessage = (message: ChatMessage) => {
      addMessage(roomId, {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        from: message.from || "",
        fromUsername: message.fromUsername || "",
        message: message.content,
        timestamp: Date.now(),
        status: message.status as "sent" | "delivered" | "read",
        roomId: message.roomId,
      });
    };

    const handleMessageStatus = (data: {
      messageId: string;
      status: "sent" | "delivered" | "read";
    }) => {
      updateMessageStatus(roomId, data.messageId, data.status);
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_status", handleMessageStatus);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_status", handleMessageStatus);
      socket.emit("leave_room", roomId);
    };
  }, [roomId, addMessage, updateMessageStatus]);

  const sendMessage = async (content: string) => {
    const socket = socketService.getSocket();
    if (!socket || !roomId) return;

    const messageId = uuidv4();

    const message: ChatMessage = {
      id: messageId,
      content,
      senderId: user!.id,
      from: user!.userName || "",
      fromUsername: user!.userName || "",
      message: content,
      timestamp: Date.now(),
      status: "sent",
      roomId,
    };

    addMessage(roomId, message);

    socket.emit("send_message", {
      messageId,
      content,
      roomId,
    });
  };

  return {
    messages,
    sendMessage,
    activeUser,
  };
}
