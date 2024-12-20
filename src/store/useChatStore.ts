import { create } from "zustand";
import { ChatMessage, ChatUser, PresenceUpdate } from "@/types/chat.types";

interface ChatState {
  // Core State
  messages: Record<string, ChatMessage[]>;
  activeRoomId: string | null;
  activeUser: ChatUser | null;
  onlineUsers: string[];
  typingStatus: Record<string, boolean>;
  socketConnected: boolean;
  joinedRooms: string[];

  // Message Actions
  updateUserPresence: (presence: PresenceUpdate) => void;
  removeUserFromSidebar: (username: string) => void;
  addMessage: (roomId: string, message: ChatMessage) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  updateMessageStatus: (
    roomId: string,
    messageId: string,
    status: ChatMessage["status"],
  ) => void;
  clearMessages: (roomId: string) => void;
  getMessagesForRoom: (roomId: string) => ChatMessage[];

  // Room Actions
  setActiveRoom: (roomId: string | null) => void;
  addJoinedRoom: (roomId: string) => void;
  removeJoinedRoom: (roomId: string) => void;

  // User Actions
  setActiveUser: (user: ChatUser | null) => void;
  setOnlineUsers: (users: string[]) => void;
  setTypingStatus: (roomId: string, isTyping: boolean) => void;
  setSocketConnected: (connected: boolean) => void;

  // Chat Session
  initializeChat: (roomId: string, user: ChatUser) => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  // Initial State
  messages: {},
  activeRoomId: null,
  activeUser: null,
  onlineUsers: [],
  typingStatus: {},
  socketConnected: false,
  joinedRooms: [],

  updateUserPresence: (presence: PresenceUpdate) =>
    set((state) => ({
      activeUser:
        state.activeUser?.id === presence.userId
          ? {
              ...state.activeUser,
              status: presence.status,
              lastActive: presence.lastActive,
            }
          : state.activeUser,
      onlineUsers:
        presence.status === "online"
          ? [...new Set([...state.onlineUsers, presence.username])]
          : state.onlineUsers.filter((user) => user !== presence.username),
    })),

  removeUserFromSidebar: (username) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((user) => user !== username),
    })),

  addMessage: (roomId, message) =>
    set((state) => {
      const existingMessages = state.messages[roomId] || [];
      const isDuplicate = existingMessages.some((msg) => msg.id === message.id);

      if (isDuplicate) return state;

      return {
        messages: {
          ...state.messages,
          [roomId]: [...existingMessages, message],
        },
      };
    }),

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
      const { [roomId]: _, ...remainingMessages } = state.messages; //eslint-disable-line @typescript-eslint/no-unused-vars
      return { messages: remainingMessages };
    }),

  getMessagesForRoom: (roomId) => get().messages[roomId] || [],

  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  addJoinedRoom: (roomId) =>
    set((state) => ({
      joinedRooms: [...state.joinedRooms, roomId],
    })),

  removeJoinedRoom: (roomId) =>
    set((state) => ({
      joinedRooms: state.joinedRooms.filter((id) => id !== roomId),
    })),

  setActiveUser: (user) => set({ activeUser: user }),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  setTypingStatus: (roomId, isTyping) =>
    set((state) => ({
      typingStatus: {
        ...state.typingStatus,
        [roomId]: isTyping,
      },
    })),

  setSocketConnected: (connected) => set({ socketConnected: connected }),

  initializeChat: (roomId, user) =>
    set((state) => ({
      activeRoomId: roomId,
      activeUser: user,
      joinedRooms: [...state.joinedRooms, roomId],
      messages: {
        ...state.messages,
        [roomId]: state.messages[roomId] || [],
      },
    })),
}));
