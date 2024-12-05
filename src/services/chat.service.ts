export class ChatService {
  static async initializeSession(bookingId: string) {
    // Create secure chat room
    const room = await this.createRoom(bookingId);

    // Set up real-time listeners
    socketService.on(`chat:${room.id}`, {
      onMessage: this.handleNewMessage,
      onTyping: this.handleTypingStatus,
      onPresence: this.handlePresenceUpdate,
    });

    return room;
  }

  static async sendMessage(roomId: string, message: ChatMessage) {
    // Encrypt message
    const encrypted = await this.encryptMessage(message);

    // Send via socket
    socketService.emit("chat:message", {
      roomId,
      message: encrypted,
    });

    // Store in database
    return this.persistMessage(roomId, message);
  }
}
