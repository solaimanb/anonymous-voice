export interface ChatUser {
  id: string;
  key: string;
  name?: string;
  username: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastActive?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
  appointmentDuration?: string;
  appointmentTime?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  from: string;
  fromUsername: string;
  message: string;
  timestamp: number;
  status: "sent" | "delivered" | "read";
  roomId: string;
  _id?: string;
  createdAt?: string;
}

export interface SocketMessage {
  type: "message" | "typing" | "presence";
  message?: ChatMessage;
  userId?: string;
  username?: string;
  roomId?: string;
}

export type Message = ChatMessage;

export interface TypingStatus {
  roomId: string;
  userId: string;
  username: string;
  isTyping: boolean;
}

export interface PresenceUpdate {
  roomId: string;
  userId: string;
  username: string;
  email?: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastActive: string;
}
