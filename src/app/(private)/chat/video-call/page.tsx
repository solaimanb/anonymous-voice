"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import PreJoinScreen from "@/components/chat/PreJoinScreen";
import Loading from "@/app/loading";
import { useVideoCall } from "@/hooks/useVideoCall";

export default function VideoCallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasJoined, setHasJoined] = useState(false);

  const roomId = searchParams.get("roomId");
  const isCaller = searchParams.get("caller") === "true";
  const user = AuthService.getStoredUser();

  // Handle authentication
  useMemo(() => {
    if (!user?.userName || !roomId) {
      router.push("/login");
    }
  }, [user, roomId, router]);

  // Don't proceed if not authenticated
  if (!user?.userName || !roomId) {
    return null;
  }

  const {
    room,
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    error,
    toggleAudio,
    toggleVideo,
  } = useVideoCall({
    roomId,
    isCaller,
    username: user.userName,
  });

  const handleJoinCall = async () => {
    if (!room) return;
    setHasJoined(true);
    if (!isCaller) {
      await room.createAnswer();
    }
  };

  const handleLeaveCall = () => {
    room?.leave();
    router.push("/chat");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/chat")}
            className="text-blue-500 hover:underline"
          >
            Return to Chat
          </button>
        </div>
      </div>
    );
  }

  if (!localStream) return <Loading />;

  return hasJoined ? (
    <VideoCall
      localStream={localStream}
      remoteStream={remoteStream}
      isAudioEnabled={isAudioEnabled}
      isVideoEnabled={isVideoEnabled}
      toggleAudio={toggleAudio}
      toggleVideo={toggleVideo}
      onLeaveCall={handleLeaveCall}
    />
  ) : (
    <PreJoinScreen
      localStream={localStream}
      isAudioEnabled={isAudioEnabled}
      isVideoEnabled={isVideoEnabled}
      toggleAudio={toggleAudio}
      toggleVideo={toggleVideo}
      onJoin={handleJoinCall}
    />
  );
}
