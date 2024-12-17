// import { Socket } from "socket.io-client";
// import { createSocketConnection } from "@/config/socket.config";
// import { ChatMessage, SocketMessage } from "@/types/chat.types";
// import { useChatStore } from "@/store/useChatStore";

// class SocketService {
//   private static instance: SocketService;
//   private socket: Socket | null = null;

//   private constructor() {}

//   public static getInstance(): SocketService {
//     if (!SocketService.instance) {
//       SocketService.instance = new SocketService();
//     }
//     return SocketService.instance;
//   }

//   connect(
//     token: string,
//     userData: { username: string; userId: string },
//   ): Socket {
//     this.disconnect();

//     // Reconnection strategy
//     this.socket = createSocketConnection(token, userData);

//     // Connection state management
//     this.socket.on("connect", () => {
//       console.log("Socket connected successfully");
//       this.emit("user:online", { userId: userData.userId });
//     });

//     this.socket.on("reconnect", () => {
//       console.log("Socket reconnected");
//       // Rejoin active rooms after reconnection
//       const activeRoom = useChatStore.getState().activeRoomId;
//       if (activeRoom) {
//         this.emit("room:join", { roomId: activeRoom });
//       }
//     });

//     return this.socket;
//   }

//   private setupEventListeners(): void {
//     if (!this.socket) return;

//     this.socket.on("connect", () => {
//       console.log("Socket connected successfully");
//     });

//     this.socket.on("disconnect", (reason) => {
//       console.log("Socket disconnected:", reason);
//     });

//     this.socket.on("connect_error", (error) => {
//       console.error("Socket connection error:", error);
//     });
//   }

//   getSocket(): Socket | null {
//     return this.socket;
//   }

//   on<T>(event: string, callback: (data: T) => void): void {
//     if (this.socket) {
//       this.socket.on(event, callback);
//     }
//   }

//   emit<T>(event: string, data: T): void {
//     if (this.socket) {
//       this.socket.emit(event, data);
//     }
//   }

//   off<T>(event: string, callback: (data: T) => void): void {
//     if (this.socket) {
//       this.socket.off(event, callback);
//     }
//   }

//   disconnect(): void {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//   }

//   sendMessage(message: ChatMessage): void {
//     if (this.socket) {
//       this.socket.emit("private:message", message);
//     }
//   }

//   listenForMessages(callback: (message: SocketMessage) => void): void {
//     this.on("private:message", callback);
//   }
// }

// export const socketService = SocketService.getInstance();

import { Socket } from "socket.io-client";
import { createSocketConnection } from "@/config/socket.config";
import { ChatMessage } from "@/types/chat.types";
import { useChatStore } from "@/store/useChatStore";

interface QueuedMessage<T> {
  event: string;
  data: T;
}

interface TypingData {
  userId: string;
  isTyping: boolean;
}

interface PresenceData {
  userId: string;
  status: string;
}

interface MessageAckData {
  messageId: string;
  status: ChatMessage["status"];
}

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private messageQueue: Array<QueuedMessage<unknown>> = [];
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RETRY_INTERVAL = 1000;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(token: string, username: string, userId: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = createSocketConnection(token, { username, userId });

    // Immediate connection handler
    this.socket.on("connect", () => {
      console.log("Socket connected 🚀");
      this.reconnectAttempts = 0;
      this.setupConnectionHandlers();
      this.setupMessageHandlers();
      useChatStore.getState().setSocketConnected(true);
      this.emit("user:online", { userId });
      // Process any queued messages right after connection
      this.processMessageQueue();
    });

    // Initialize connection
    this.socket.connect();

    return this.socket;
  }

  private setupConnectionHandlers(): void {
    if (!this.socket) return;

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
      useChatStore.getState().setSocketConnected(false);
    });

    this.socket.on("reconnect_attempt", () => {
      if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
        this.socket?.disconnect();
        return;
      }
      this.reconnectAttempts++;
    });

    this.socket.on("reconnect", () => {
      const store = useChatStore.getState();
      store.setSocketConnected(true);
      if (store.activeRoomId) {
        this.emit("room:join", { roomId: store.activeRoomId });
      }
    });
  }

  private setupMessageHandlers(): void {
    if (!this.socket) return;

    this.socket.on("message:receive", (message: ChatMessage) => {
      const roomId = `${message.sentBy}-${message.sentTo}`;
      const store = useChatStore.getState();
      store.addMessage(roomId, message);
    });

    this.socket.on("message:ack", (data: MessageAckData) => {
      const store = useChatStore.getState();
      const activeRoom = store.activeRoomId;
      if (activeRoom) {
        store.updateMessageStatus(activeRoom, data.messageId, data.status);
      }
    });

    this.socket.on("user:typing", (data: TypingData) => {
      useChatStore.getState().setTypingStatus(data.userId, data.isTyping);
    });

    this.socket.on("user:presence", (data: PresenceData) => {
      const store = useChatStore.getState();
      store.setOnlineUsers([...store.onlineUsers, data.userId]);
    });
  }

  private queueMessage<T>(event: string, data: T): void {
    this.messageQueue.push({ event, data });
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.emit(message.event, message.data);
      }
    }
  }

  emit<T>(event: string, data: T): void {
    if (!this.socket?.connected) {
      this.queueMessage(event, data);
      setTimeout(() => this.processMessageQueue(), this.RETRY_INTERVAL);
      return;
    }
    this.socket.emit(event, data);
  }

  on<T>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback);
  }

  off<T>(event: string, callback: (data: T) => void): void {
    this.socket?.off(event, callback);
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.messageQueue = [];
      useChatStore.getState().setSocketConnected(false);
    }
  }
}

export const socketService = SocketService.getInstance();
