"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";

export default function VoiceCallPage() {
  const { id } = useParams();
  const [participants, setParticipants] = useState<string[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const [user1, user2] = (id as string).split("-");
    setParticipants([user1, user2]);

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { username: user1 },
    });

    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", {
          to: user2,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      const remoteAudio = document.createElement("audio");
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.autoplay = true;
      document.body.appendChild(remoteAudio);
    };

    socketRef.current.on("ice-candidate", (candidate: RTCIceCandidateInit) => {
      peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socketRef.current?.disconnect();
      peerConnection.current?.close();
    };
  }, [id]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });

      const offer = await peerConnection.current?.createOffer();
      await peerConnection.current?.setLocalDescription(offer);

      socketRef.current?.emit("voice-call-offer", {
        to: participants[1],
        offer: peerConnection.current?.localDescription,
      });

      setIsCallActive(true);
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  const endCall = () => {
    peerConnection.current?.close();
    setIsCallActive(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-4">Voice Call</h1>
      <p className="mb-4">Participants: {participants.join(", ")}</p>
      {!isCallActive ? (
        <Button onClick={startCall}>Start Call</Button>
      ) : (
        <Button onClick={endCall} variant="destructive">
          End Call
        </Button>
      )}
    </div>
  );
}
