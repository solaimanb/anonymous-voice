import api from "@/config/axios.config";
import { socketService } from "./socket.service";
import { useChatStore } from "@/store/useChatStore";
import { ChatMessage } from "@/types/chat.types";

interface MessageInput {
  content: string;
  fromUsername: string;
  sentTo: string;
  message: string;
}

interface APIResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: {
    _id: string;
    sentBy: string;
    sentTo: string;
    message: string;
    isSeen: boolean;
    createdAt: string;
  }[];
}

export class ChatService {
  static async initializeSession(appointment: {
    mentorUserName: string;
    menteeUserName: string;
    _id: string;
  }) {
    const roomId = `${appointment.mentorUserName}-${appointment.menteeUserName}`;
    const messages = await this.fetchMessages(
      appointment.mentorUserName,
      appointment.menteeUserName,
      roomId,
    );

    useChatStore.getState().setMessages(roomId, this.convertMessages(messages));
    useChatStore.getState().setActiveRoom(roomId);

    return { roomId };
  }

  static async fetchMessages(
    mentorUsername: string,
    menteeUsername: string,
    roomId: string,
  ): Promise<APIResponse["data"]> {
    try {
      const response = await api.get<APIResponse>("/api/v1/message", {
        params: {
          mentorUsername,
          menteeUsername,
        },
      });
      return response.data.data.filter(
        (msg) =>
          ((msg.sentBy === mentorUsername && msg.sentTo === menteeUsername) ||
            (msg.sentBy === menteeUsername && msg.sentTo === mentorUsername)) &&
          `${msg.sentBy}-${msg.sentTo}` === roomId,
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  private static convertMessages(
    apiMessages: APIResponse["data"],
  ): ChatMessage[] {
    return apiMessages.map((msg) => ({
      id: msg._id,
      content: msg.message,
      senderId: msg.sentBy,
      from: msg.sentBy,
      fromUsername: msg.sentBy,
      message: msg.message,
      timestamp: new Date(msg.createdAt).getTime(),
      status: msg.isSeen ? "read" : "delivered",
      roomId: `${msg.sentBy}-${msg.sentTo}`,
    }));
  }

  static async sendMessage(roomId: string, message: MessageInput) {
    try {
      const response = await api.post<APIResponse>(
        "/api/v1/message/create-message",
        {
          sentBy: message.fromUsername,
          sentTo: message.sentTo,
          message: message.message,
          isSeen: false,
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to send message");
      }

      const messageData = response.data.data[0];

      if (!messageData) {
        throw new Error("No message data returned from API");
      }

      const newMessage: ChatMessage = {
        id: messageData._id,
        content: message.content,
        senderId: message.fromUsername,
        from: message.fromUsername,
        fromUsername: message.fromUsername,
        message: message.message,
        timestamp: Date.now(),
        status: "sent",
        roomId,
      };

      useChatStore.getState().addMessage(roomId, newMessage);
      socketService.emit("private:message", newMessage);
      return newMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
  static async markMessageAsRead(messageId: string): Promise<void> {
    try {
      await api.get(`/api/v1/message/${messageId}`);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  }

  static setTypingStatus(roomId: string, isTyping: boolean) {
    socketService.emit("chat:typing", { roomId, isTyping });
  }

  static updateMessageStatus(
    roomId: string,
    messageId: string,
    status: ChatMessage["status"],
  ) {
    useChatStore.getState().updateMessageStatus(roomId, messageId, status);
    socketService.emit("chat:status", { roomId, messageId, status });
  }
}
