import { Socket } from "socket.io-client";
import { createSocketConnection } from "@/config/socket.config";
import { ChatMessage, SocketMessage } from "@/types/chat.types";
import { useChatStore } from "@/store/useChatStore";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  connect(
    token: string,
    userData: { username: string; userId: string },
  ): Socket {
    this.disconnect();

    // Reconnection strategy
    this.socket = createSocketConnection(token, userData);

    // Connection state management
    this.socket.on("connect", () => {
      console.log("Socket connected successfully");
      this.emit("user:online", { userId: userData.userId });
    });

    this.socket.on("reconnect", () => {
      console.log("Socket reconnected");
      // Rejoin active rooms after reconnection
      const activeRoom = useChatStore.getState().activeRoomId;
      if (activeRoom) {
        this.emit("room:join", { roomId: activeRoom });
      }
    });

    return this.socket;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  on<T>(event: string, callback: (data: T) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit<T>(event: string, data: T): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  off<T>(event: string, callback: (data: T) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: ChatMessage): void {
    if (this.socket) {
      this.socket.emit("private:message", message);
    }
  }

  listenForMessages(callback: (message: SocketMessage) => void): void {
    this.on("private:message", callback);
  }
}

export const socketService = SocketService.getInstance();
