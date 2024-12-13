import { ChatMessage, ChatUser } from "@/types/chat.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatState {
  messages: Record<string, ChatMessage[]>;
  activeRoomId: string | null;
  activeUser: ChatUser | null;
  isTyping: Record<string, boolean>;
  onlineUsers: string[];
}

interface ChatActions {
  // Message actions
  addMessage: (roomId: string, message: ChatMessage) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  updateMessageStatus: (
    roomId: string,
    messageId: string,
    status: ChatMessage["status"],
  ) => void;
  clearMessages: (roomId: string) => void;

  // Room actions
  setActiveRoom: (roomId: string) => void;
  getMessagesForRoom: (roomId: string) => ChatMessage[];

  // User actions
  setActiveUser: (user: ChatUser | null) => void;
  setTypingStatus: (roomId: string, isTyping: boolean) => void;
  setOnlineUsers: (users: string[]) => void;

  // Chat session
  initializeChat: (roomId: string, user: ChatUser) => void;
}

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      messages: {},
      activeRoomId: null,
      activeUser: null,
      isTyping: {},
      onlineUsers: [],

      addMessage: (roomId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: [...(state.messages[roomId] || []), message],
          },
        })),

      setMessages: (roomId, messages) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: messages,
          },
        })),

      updateMessageStatus: (roomId, messageId, status) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]:
              state.messages[roomId]?.map((msg) =>
                msg.id === messageId ? { ...msg, status } : msg,
              ) || [],
          },
        })),

      clearMessages: (roomId) =>
        set((state) => {
          const { [roomId]: _, ...restMessages } = state.messages; // eslint-disable-line @typescript-eslint/no-unused-vars
          return { messages: restMessages };
        }),

      setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

      getMessagesForRoom: (roomId) => get().messages[roomId] || [],

      setActiveUser: (user) => set({ activeUser: user }),

      setTypingStatus: (roomId, isTyping) =>
        set((state) => ({
          isTyping: { ...state.isTyping, [roomId]: isTyping },
        })),

      setOnlineUsers: (users) => set({ onlineUsers: users }),

      initializeChat: (roomId, user) =>
        set((state) => ({
          activeRoomId: roomId,
          activeUser: user,
          messages: {
            ...state.messages,
            [roomId]: state.messages[roomId] || [],
          },
        })),
    }),
    {
      name: "chat-storage",
      version: 1,
      partialize: (state) => ({
        messages: state.messages,
        activeRoomId: state.activeRoomId,
        activeUser: state.activeUser,
      }),
    },
  ),
);
