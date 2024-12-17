// import api from "@/config/axios.config";
// import { socketService } from "./socket.service";
// import { useChatStore } from "@/store/useChatStore";
// import { ChatMessage } from "@/types/chat.types";

// interface TypingStatus {
//   roomId: string;
//   userId: string;
//   username: string;
//   isTyping: boolean;
// }

// interface PresenceUpdate {
//   roomId: string;
//   userId: string;
//   username: string;
//   email: string;
//   avatar?: string;
//   status: "online" | "offline" | "away";
//   lastActive: string;
// }

// interface SocketData {
//   type: "message" | "typing" | "presence";
//   message?: ChatMessage;
//   status?: TypingStatus;
//   presence?: PresenceUpdate;
// }

// export class ChatService {
//   static async initializeSession(bookingId: string) {
//     const room = await this.createRoom(bookingId);

//     // Generate unique room ID based on booking
//     const uniqueRoomId = `chat_${bookingId}_${room.id}`;

//     // Leave any existing rooms first
//     const currentRoom = useChatStore.getState().activeRoomId;
//     if (currentRoom) {
//       socketService.emit("room:leave", { roomId: currentRoom });
//     }

//     // Join new room with proper scoping
//     socketService.emit("room:join", {
//       roomId: uniqueRoomId,
//       bookingId,
//       mentorId: room.mentorId,
//       menteeId: room.menteeId,
//     });

//     // Listen only to specific room events
//     socketService.on(`room:${uniqueRoomId}`, (data: SocketData) => {
//       console.log("Room data from chat.service:", data);
//       if (data.roomId !== uniqueRoomId) return;

//       switch (data.type) {
//         case "message":
//           this.handleNewMessage(uniqueRoomId, data.message!);
//           break;
//         case "typing":
//           this.handleTypingStatus(data.status!);
//           break;
//         case "presence":
//           this.handlePresenceUpdate(data.presence!);
//           break;
//       }
//     });

//     return { ...room, uniqueRoomId };
//   }

//   static async createRoom(bookingId: string) {
//     try {
//       const response = await api.post("/api/v1/chat/rooms", { bookingId });
//       return response.data;
//     } catch (error) {
//       console.error("Error creating chat room:", error);
//       throw error;
//     }
//   }

//   static async sendMessage(roomId: string, message: ChatMessage) {
//     // Fix: Add proper message validation
//     if (!message.content.trim()) return;

//     const encrypted = await this.encryptMessage(message);

//     // Fix: Use consistent event naming
//     socketService.emit("room:message", {
//       roomId,
//       message: encrypted,
//       timestamp: Date.now(),
//       status: "sent",
//     });

//     useChatStore.getState().addMessage(roomId, {
//       ...message,
//       status: "sent",
//     });
//   }

//   static async encryptMessage(message: ChatMessage) {
//     return message;
//   }

//   private static handleNewMessage(roomId: string, message: ChatMessage) {
//     useChatStore.getState().addMessage(roomId, message);
//   }

//   private static handleTypingStatus(status: TypingStatus) {
//     useChatStore.getState().setTypingStatus(status.roomId, status.isTyping);
//   }

//   private static handlePresenceUpdate(presence: PresenceUpdate) {
//     const store = useChatStore.getState();
//     store.setActiveUser(
//       presence.status === "offline"
//         ? null
//         : {
//             id: presence.userId,
//             key: presence.userId,
//             username: presence.username,
//             email: presence.email,
//             status: presence.status,
//             lastActive: presence.lastActive,
//             avatar: presence.avatar,
//           },
//     );
//   }

//   static setTypingStatus(roomId: string, isTyping: boolean) {
//     socketService.emit("chat:typing", { roomId, isTyping });
//   }

//   static updateMessageStatus(
//     roomId: string,
//     messageId: string,
//     status: ChatMessage["status"],
//   ) {
//     useChatStore.getState().updateMessageStatus(roomId, messageId, status);
//     socketService.emit("chat:status", { roomId, messageId, status });
//   }
// }

import api from "@/config/axios.config";
import { socketService } from "./socket.service";
import { useChatStore } from "@/store/useChatStore";
import { ChatMessage, TypingStatus, PresenceUpdate } from "@/types/chat.types";

export class ChatService {
  static async initializeSession(userId: string) {
    try {
      const messages = await this.fetchMessages(userId);
      const store = useChatStore.getState();

      socketService.emit("user:join", {
        userId,
        timestamp: Date.now(),
      });

      socketService.on("message:receive", (data: ChatMessage) => {
        this.handleNewMessage(userId, data);
      });

      socketService.on("user:typing", (data: TypingStatus) => {
        this.handleTypingStatus(data);
      });

      socketService.on("user:presence", (data: PresenceUpdate) => {
        this.handlePresenceUpdate(data);
      });

      store.setMessages(userId, messages);
      return { userId, messages };
    } catch (error) {
      console.error("Session initialization failed:", error);
      throw error;
    }
  }

  static async fetchMessages(userId: string) {
    const response = await api.get(
      `/api/v1/message?username=${userId}&includeAll=true`,
    );
    return response.data.data;
  }

  static async sendMessage(sentBy: string, sentTo: string, message: string) {
    const payload = {
      sentBy,
      sentTo,
      message,
      isSeen: false,
    };

    const response = await api.post("/api/v1/message/create-message", payload);
    socketService.emit("new_message", response.data);
    return response.data;
  }

  private static handleNewMessage(userId: string, message: ChatMessage) {
    const store = useChatStore.getState();
    const roomId = `${message.sentBy}-${message.sentTo}`;
    store.addMessage(roomId, message);
    socketService.emit("message:ack", {
      messageId: message._id,
      status: "delivered",
    });
  }

  private static handleTypingStatus(status: TypingStatus) {
    useChatStore.getState().setTypingStatus(status.userId, status.isTyping);
  }

  private static handlePresenceUpdate(presence: PresenceUpdate) {
    const store = useChatStore.getState();
    store.setActiveUser({
      id: presence.userId,
      username: presence.username,
      status: presence.status,
      lastActive: presence.lastActive,
    });
  }

  static disconnect(): void {
    socketService.disconnect();
    const store = useChatStore.getState();
    store.setSocketConnected(false);
    store.setActiveRoom(null);
    store.setActiveUser(null);
  }
}
