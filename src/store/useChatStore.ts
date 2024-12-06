import { create } from "zustand";

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  roomId: string;
  status: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  activeRoom: string | null;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setActiveRoom: (roomId: string | null) => void;
  updateMessageStatus: (messageId: string, status: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  activeRoom: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  setActiveRoom: (roomId) => set({ activeRoom: roomId }),
  updateMessageStatus: (messageId, status) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg,
      ),
    })),
}));
