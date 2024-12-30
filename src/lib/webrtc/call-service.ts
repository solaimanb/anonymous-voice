import { Socket } from "socket.io-client";

export interface CallInvitation {
  roomId: string;
  from: string;
  to: string;
  type: "video" | "audio";
}

export class CallService {
  static generateRoomId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static sendCallInvitation(socket: Socket, invitation: CallInvitation) {
    socket.emit("call:invite", invitation);
  }

  static acceptCall(socket: Socket, roomId: string) {
    socket.emit("call:accept", { roomId });
  }

  static rejectCall(socket: Socket, roomId: string) {
    socket.emit("call:reject", { roomId });
  }

  static listenForCallInvitations(
    socket: Socket,
    callback: (invitation: CallInvitation) => void,
  ) {
    socket.on("call:invite", callback);
  }
}
