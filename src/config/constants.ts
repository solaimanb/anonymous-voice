export const APP_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_ROOM_PARTICIPANTS: 5,
  MAX_VOICE_DURATION: 300,
  MESSAGE_BATCH_SIZE: 20,
  TYPING_INDICATOR_TIMEOUT: 3000,
  WEBSOCKET_RECONNECT_DELAY: 2000,
  API_ENDPOINTS: {
    AUTH: "/api/auth",
    USERS: "/api/users",
    ROOMS: "/api/rooms",
    MESSAGES: "/api/messages",
  },
} as const;
