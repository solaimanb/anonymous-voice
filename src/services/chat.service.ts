import api from "@/config/axios.config";
import { socketService } from "./socket.service";
import { useChatStore } from "@/store/useChatStore";
import { ChatMessage } from "@/types/chat.types";

interface TypingStatus {
  roomId: string;
  userId: string;
  username: string;
  isTyping: boolean;
}

interface PresenceUpdate {
  roomId: string;
  userId: string;
  username: string;
  email: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastActive: string;
}

interface SocketData {
  type: "message" | "typing" | "presence";
  message?: ChatMessage;
  status?: TypingStatus;
  presence?: PresenceUpdate;
  roomId: string;
}

interface MessageResponse {
  _id: string;
  sentBy: string;
  sentTo: string;
  message: string;
  roomId: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

export class ChatService {
  static async initializeSession(bookingId: string) {
    const room = await this.createRoom(bookingId);
    const uniqueRoomId = `chat_${bookingId}_${room.id}`;

    const currentRoom = useChatStore.getState().activeRoomId;
    if (currentRoom) {
      socketService.emit("room:leave", { roomId: currentRoom });
    }

    socketService.emit("room:join", {
      roomId: uniqueRoomId,
      bookingId,
      mentorId: room.mentorId,
      menteeId: room.menteeId,
    });

    // Load previous messages
    const messages = await this.fetchMessages(uniqueRoomId);
    console.log("Messages from DB:", messages);

    const chatMessages: ChatMessage[] = messages.map(
      (message: MessageResponse) => ({
        id: message._id,
        content: message.message,
        senderId: message.sentBy,
        from: message.sentBy,
        fromUsername: message.sentBy,
        message: message.message,
        timestamp: new Date(message.createdAt).getTime(),
        status: "sent",
        roomId: message.roomId,
      }),
    );
    chatMessages.forEach((message) => {
      this.handleNewMessage(uniqueRoomId, message);
    });

    socketService.on(`room:${uniqueRoomId}`, (data: SocketData) => {
      if (data.type === "message") {
        this.handleNewMessage(uniqueRoomId, data.message!);
      }
    });

    return { ...room, uniqueRoomId };
  }

  static async createRoom(bookingId: string) {
    const response = await api.post("/api/v1/chat/rooms", { bookingId });
    return response.data;
  }

  static async fetchMessages(roomId: string): Promise<MessageResponse[]> {
    try {
      const [user1, user2] = roomId.split("-");

      // Fetch messages for both users in the conversation
      const response1 = await api.get(`/api/v1/message?sentBy=${user1}`);
      const response2 = await api.get(`/api/v1/message?sentBy=${user2}`);

      // Combine and sort messages from both users
      const allMessages = [...response1.data.data, ...response2.data.data].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      console.log("Combined messages:", allMessages);

      const chatMessages: ChatMessage[] = allMessages.map(
        (message: MessageResponse) => ({
          id: message._id,
          content: message.message,
          senderId: message.sentBy,
          from: message.sentBy,
          fromUsername: message.sentBy,
          message: message.message,
          timestamp: new Date(message.createdAt).getTime(),
          status: message.isSeen ? "read" : ("sent" as const),
          roomId: roomId,
        }),
      );

      useChatStore.getState().setMessages(roomId, chatMessages);
      return allMessages;
    } catch (error) {
      console.log("Error fetching messages:", error);
      return [];
    }
  }

  static async sendMessage(roomId: string, message: ChatMessage) {
    if (!message.content.trim()) return;

    try {
      const response = await api.post("/api/v1/message/create-message", {
        sentBy: message.fromUsername,
        sentTo: message.from,
        message: message.content,
        roomId: roomId,
        isSeen: false,
      });

      const finalMessage = {
        ...message,
        id: response.data._id,
        timestamp: Date.now(),
      };

      // Emit to the specific room channel
      socketService.emit("room:message", {
        type: "message",
        roomId,
        message: finalMessage,
      });

      socketService.emit("message:new", { roomId });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  static async encryptMessage(message: ChatMessage) {
    return message;
  }

  private static handleNewMessage(roomId: string, message: ChatMessage) {
    useChatStore.getState().addMessage(roomId, message);
  }

  private static handleTypingStatus(status: TypingStatus) {
    useChatStore.getState().setTypingStatus(status.roomId, status.isTyping);
  }

  private static handlePresenceUpdate(presence: PresenceUpdate) {
    const store = useChatStore.getState();
    store.setActiveUser(
      presence.status === "offline"
        ? null
        : {
            id: presence.userId,
            key: presence.userId,
            username: presence.username,
            email: presence.email,
            status: presence.status,
            lastActive: presence.lastActive,
            avatar: presence.avatar,
          },
    );
  }

  static setTypingStatus(roomId: string, isTyping: boolean) {
    socketService.emit("chat:typing", { roomId, isTyping });
  }

  static async updateMessageStatus(
    roomId: string,
    messageId: string,
    status: ChatMessage["status"],
  ) {
    try {
      // Update local state first for optimistic UI
      useChatStore.getState().updateMessageStatus(roomId, messageId, status);

      // Emit socket event
      socketService.emit("chat:status", { roomId, messageId, status });

      // Update server state
      await api.patch(`/api/v1/message/update-status/${messageId}`, {
        status,
        roomId,
      });
    } catch (error) {
      // Revert optimistic update if server request fails
      const previousStatus = status === "read" ? "delivered" : "sent";
      useChatStore
        .getState()
        .updateMessageStatus(roomId, messageId, previousStatus);
      console.error("Error updating message status:", error);
    }
  }

  static async markMessageAsSeen(messageId: string) {
    await api.patch(`/api/v1/message/${messageId}`, { isSeen: true });
  }
}
