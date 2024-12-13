export interface ChatUser {
  id: string;
  key: string;
  name?: string;
  username: string;
  avatar?: string;
  status: string;
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
}

export type Message = ChatMessage;
