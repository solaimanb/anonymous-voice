export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  username?: string;
  email?: string;
  isAnonymous: boolean;
  lastActiveAt: Date;
  status: "online" | "offline" | "away";
  settings: UserSettings;
  role: "user" | "moderator" | "admin";
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  soundEnabled: boolean;
  messagePreview: boolean;
}

export interface Message extends BaseEntity {
  roomId: string;
  senderId: string;
  type: "text" | "audio" | "video";
  content: string;
  mediaUrl?: string;
  status: "sending" | "sent" | "delivered" | "read";
  metadata: {
    duration?: number;
    size?: number;
    readBy?: string[];
  };
}

export interface Room extends BaseEntity {
  name: string;
  type: "private";
  createdBy: string;
  participants: string[];
  lastMessage?: Message;
  metadata: {
    description?: string;
    isModerated: boolean;
  };
}
