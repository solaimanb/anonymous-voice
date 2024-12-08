import { create } from "zustand";

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
  status: string;
  timestamp: string;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastActive: string;
  email: string;
}

interface ChatState {
  messages: ChatMessage[];
  activeRoom: string | null;
  activeUser: ChatUser | null;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setActiveRoom: (roomId: string | null) => void;
  setActiveUser: (user: ChatUser | null) => void;
  updateMessageStatus: (messageId: string, status: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  activeRoom: null,
  activeUser: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setActiveRoom: (roomId) => set({ activeRoom: roomId }),
  setActiveUser: (user) => set({ activeUser: user }),
  updateMessageStatus: (messageId, status) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg,
      ),
    })),
}));
