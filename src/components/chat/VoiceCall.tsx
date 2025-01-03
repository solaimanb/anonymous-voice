import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { CallService } from "@/lib/call/call-service";
import { Button } from "@/components/ui/button";
import { PhoneOff } from "lucide-react";

interface VoiceCallProps {
  socket: Socket;
  roomId: string;
  isCaller: boolean;
  onEndCall: () => void;
}

export const VoiceCall: React.FC<VoiceCallProps> = ({
  socket,
  roomId,
  isCaller,
  onEndCall,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let peerConnection: RTCPeerConnection;

    const initializeCall = async () => {
      try {
        peerConnection = await CallService.initializeCall(
          socket,
          isCaller,
          roomId,
        );
        setIsConnected(true);

        if (isCaller) {
          await CallService.createOffer(peerConnection, socket, roomId);
        }

        // Handle incoming offer
        socket.on("call-offer", async ({ offer, roomId: incomingRoomId }) => {
          if (roomId === incomingRoomId && !isCaller) {
            await CallService.handleOffer(
              peerConnection,
              socket,
              offer,
              roomId,
            );
          }
        });

        // Handle answer
        socket.on("call-answer", async ({ answer }) => {
          if (peerConnection.currentRemoteDescription === null) {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(answer),
            );
          }
        });

        // Handle ICE candidates
        socket.on("ice-candidate", async ({ candidate }) => {
          try {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(candidate),
            );
          } catch (e) {
            console.error("Error adding ICE candidate:", e);
          }
        });
      } catch (err) {
        setError("Failed to initialize call");
        console.error(err);
      }
    };

    initializeCall();

    return () => {
      peerConnection?.close();
      socket.off("call-offer");
      socket.off("call-answer");
      socket.off("ice-candidate");
    };
  }, [socket, roomId, isCaller]);

  const handleEndCall = () => {
    socket.emit("call:end", { roomId });
    onEndCall();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-background p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
          {error && <span className="text-destructive text-sm">{error}</span>}
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleEndCall}
          className="rounded-full"
        >
          <PhoneOff className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
