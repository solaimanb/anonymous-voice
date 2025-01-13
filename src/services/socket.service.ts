import api from "@/config/axios.config";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  sentBy: string;
  sentTo: string;
  message: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
      throw new Error("NEXT_PUBLIC_SOCKET_URL is not defined");
    }

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
    });

    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  on<T>(event: string, callback: (data: T) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit<T>(event: string, data: T) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  off<T>(event: string, callback: (data: T) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // API methods
  async saveMessage(data: {
    sentBy: string;
    sentTo: string;
    message: string;
    isSeen: boolean;
  }): Promise<ApiResponse<Message>> {
    try {
      const response = await api.post<ApiResponse<Message>>(
        "/api/v1/message/create-message",
        data,
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error saving message:", error);
        throw new Error(`Error saving message: ${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        throw new Error("Unexpected error occurred while saving message");
      }
    }
  }

  async getMessagesByUsername(
    username: string,
    page: number,
    limit: number = 10,
  ): Promise<ApiResponse<Message[]>> {
    try {
      const response = await api.get<ApiResponse<Message[]>>(
        `/api/v1/message`,
        {
          params: { username, page, limit },
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching messages:", error);
        throw new Error(`Error fetching messages: ${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        throw new Error("Unexpected error occurred while fetching messages");
      }
    }
  }

  async getMessageById(messageId: string): Promise<ApiResponse<Message>> {
    try {
      const response = await api.get<ApiResponse<Message>>(
        `/api/v1/message/${messageId}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching message:", error);
        throw new Error(`Error fetching message: ${error.message}`);
      } else {
        console.error("Unexpected error:", error);
        throw new Error("Unexpected error occurred while fetching message");
      }
    }
  }
}

export const socketService = new SocketService();
