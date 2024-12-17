// export interface ChatUser {
//   id: string;
//   key: string;
//   name?: string;
//   username: string;
//   avatar?: string;
//   status: "online" | "offline" | "away";
//   lastActive?: string;
//   email?: string;
//   role?: string;
//   avatarUrl?: string;
//   appointmentDuration?: string;
//   appointmentTime?: string;
// }

// export interface ChatMessage {
//   id: string;
//   content: string;
//   senderId: string;
//   from: string;
//   fromUsername: string;
//   message: string;
//   timestamp: number;
//   status: "sent" | "delivered" | "read";
//   roomId: string;
// }

// export interface SocketMessage {
//   type: "message" | "typing" | "presence";
//   message?: ChatMessage;
//   userId?: string;
//   username?: string;
//   roomId?: string;
// }

// export type Message = ChatMessage;

// export interface TypingStatus {
//   roomId: string;
//   userId: string;
//   username: string;
//   isTyping: boolean;
// }

// export interface PresenceUpdate {
//   roomId: string;
//   userId: string;
//   username: string;
//   email?: string;
//   avatar?: string;
//   status: "online" | "offline" | "away";
//   lastActive: string;
// }

export interface ChatUser {
  id: string;
  username: string;
  name?: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string;
  status: "online" | "offline" | "away";
  lastActive?: string;
  role?: string;
}

export interface ChatMessage {
  _id: string;
  id: string;
  sentBy: string;
  sentTo: string;
  message: string;
  isSeen: boolean;
  timestamp: number;
  status: "sent" | "delivered" | "read";
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface SocketMessage {
  type: "message" | "typing" | "presence";
  message?: ChatMessage;
  userId?: string;
  username?: string;
}

export interface TypingStatus {
  userId: string;
  username: string;
  isTyping: boolean;
}

export interface PresenceUpdate {
  userId: string;
  username: string;
  status: "online" | "offline" | "away";
  lastActive: string;
}

export type Message = ChatMessage;
