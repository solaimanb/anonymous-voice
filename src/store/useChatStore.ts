// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { ChatMessage, ChatUser } from "@/types/chat.types";

// interface ChatState {
//   // Core State
//   messages: Record<string, ChatMessage[]>;
//   activeRoomId: string | null;
//   activeUser: ChatUser | null;
//   onlineUsers: string[];
//   typingStatus: Record<string, boolean>;
//   socketConnected: boolean;
//   joinedRooms: string[];

//   // Message Actions
//   addMessage: (roomId: string, message: ChatMessage) => void;
//   setMessages: (roomId: string, messages: ChatMessage[]) => void;
//   updateMessageStatus: (
//     roomId: string,
//     messageId: string,
//     status: ChatMessage["status"],
//   ) => void;
//   clearMessages: (roomId: string) => void;
//   getMessagesForRoom: (roomId: string) => ChatMessage[];

//   // Room Actions
//   setActiveRoom: (roomId: string | null) => void;
//   addJoinedRoom: (roomId: string) => void;
//   removeJoinedRoom: (roomId: string) => void;

//   // User Actions
//   setActiveUser: (user: ChatUser | null) => void;
//   setOnlineUsers: (users: string[]) => void;
//   setTypingStatus: (roomId: string, isTyping: boolean) => void;
//   setSocketConnected: (connected: boolean) => void;

//   // Chat Session
//   initializeChat: (roomId: string, user: ChatUser) => void;
// }

// export const useChatStore = create<ChatState>()(
//   persist(
//     (set, get) => ({
//       // Initial State
//       messages: {},
//       activeRoomId: null,
//       activeUser: null,
//       onlineUsers: [],
//       typingStatus: {},
//       socketConnected: false,
//       joinedRooms: [],

//       // Message Actions
//       addMessage: (roomId, message) =>
//         set((state) => ({
//           messages: {
//             ...state.messages,
//             [roomId]: [...(state.messages[roomId] || []), message],
//           },
//         })),

//       setMessages: (roomId, messages) =>
//         set((state) => ({
//           messages: {
//             ...state.messages,
//             [roomId]: messages,
//           },
//         })),

//       updateMessageStatus: (roomId, messageId, status) =>
//         set((state) => ({
//           messages: {
//             ...state.messages,
//             [roomId]:
//               state.messages[roomId]?.map((msg) =>
//                 msg.id === messageId ? { ...msg, status } : msg,
//               ) || [],
//           },
//         })),

//       clearMessages: (roomId) =>
//         set((state) => {
//           const { [roomId]: _, ...remainingMessages } = state.messages; //eslint-disable-line @typescript-eslint/no-unused-vars
//           return { messages: remainingMessages };
//         }),

//       getMessagesForRoom: (roomId) => get().messages[roomId] || [],

//       // Room Actions
//       setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

//       addJoinedRoom: (roomId) =>
//         set((state) => ({
//           joinedRooms: [...state.joinedRooms, roomId],
//         })),

//       removeJoinedRoom: (roomId) =>
//         set((state) => ({
//           joinedRooms: state.joinedRooms.filter((id) => id !== roomId),
//         })),

//       // User Actions
//       setActiveUser: (user) => set({ activeUser: user }),

//       setOnlineUsers: (users) => set({ onlineUsers: users }),

//       setTypingStatus: (roomId, isTyping) =>
//         set((state) => ({
//           typingStatus: {
//             ...state.typingStatus,
//             [roomId]: isTyping,
//           },
//         })),

//       setSocketConnected: (connected) => set({ socketConnected: connected }),

//       // Chat Session
//       initializeChat: (roomId, user) =>
//         set((state) => ({
//           activeRoomId: roomId,
//           activeUser: user,
//           joinedRooms: [...state.joinedRooms, roomId],
//           messages: {
//             ...state.messages,
//             [roomId]: state.messages[roomId] || [],
//           },
//         })),
//     }),
//     {
//       name: "chat-storage",
//       version: 1,
//       partialize: (state) => ({
//         messages: state.messages,
//         activeRoomId: state.activeRoomId,
//         joinedRooms: state.joinedRooms,
//         socketConnected: state.socketConnected,
//       }),
//     },
//   ),
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatMessage, ChatUser } from "@/types/chat.types";
import socket from "@/lib/socket";

interface ChatState {
  messages: Record<string, ChatMessage[]>;
  activeRoomId: string | null;
  activeUser: ChatUser | null;
  onlineUsers: string[];
  typingStatus: Record<string, boolean>;
  socketConnected: boolean;
  joinedRooms: string[];

  // Actions
  addMessage: (roomId: string, message: ChatMessage) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  updateMessageStatus: (
    roomId: string,
    messageId: string,
    status: ChatMessage["status"],
  ) => void;
  clearMessages: (roomId: string) => void;
  setActiveRoom: (roomId: string | null) => void;
  setActiveUser: (user: ChatUser | null) => void;
  setOnlineUsers: (users: string[]) => void;
  setTypingStatus: (roomId: string, isTyping: boolean) => void;
  setSocketConnected: (connected: boolean) => void;
  handleSocketMessage: (message: ChatMessage) => void;
  handleTypingEvent: (roomId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: {},
      activeRoomId: null,
      activeUser: null,
      onlineUsers: [],
      typingStatus: {},
      socketConnected: false,
      joinedRooms: [],

      addMessage: (roomId, message) => {
        set((state) => {
          const existingMessages = state.messages[roomId] || [];
          const timestamp = new Date(message.timestamp).getTime();
          const messageWithTimestamp = { ...message, timestamp };

          return {
            messages: {
              ...state.messages,
              [roomId]: [...existingMessages, messageWithTimestamp],
            },
          };
        });
      },

      setMessages: (roomId, messages) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: messages.sort((a, b) => a.timestamp - b.timestamp),
          },
        })),

      updateMessageStatus: (roomId, messageId, status) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]:
              state.messages[roomId]?.map((msg) =>
                msg._id === messageId ? { ...msg, status } : msg,
              ) || [],
          },
        })),

      clearMessages: (roomId) =>
        set((state) => {
          const { [roomId]: _, ...remainingMessages } = state.messages; //eslint-disable-line @typescript-eslint/no-unused-vars
          return { messages: remainingMessages };
        }),

      setActiveRoom: (roomId) => set({ activeRoomId: roomId }),
      setActiveUser: (user) => set({ activeUser: user }),
      setOnlineUsers: (users) => set({ onlineUsers: users }),

      setTypingStatus: (roomId, isTyping) => {
        socket.emit("typing", { roomId, isTyping });
        set((state) => ({
          typingStatus: { ...state.typingStatus, [roomId]: isTyping },
        }));
      },

      setSocketConnected: (connected) => set({ socketConnected: connected }),

      handleSocketMessage: (message) => {
        const roomId = `${message.sentBy}-${message.sentTo}`;
        get().addMessage(roomId, message);
      },

      handleTypingEvent: (roomId, isTyping) => {
        get().setTypingStatus(roomId, isTyping);
      },
    }),
    {
      name: "chat-storage",
      version: 1,
      partialize: (state) => ({
        messages: state.messages,
        activeRoomId: state.activeRoomId,
        joinedRooms: state.joinedRooms,
        socketConnected: state.socketConnected,
      }),
    },
  ),
);
