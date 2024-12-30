import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PhoneOff, Video, Mic, MicOff, VideoOff } from "lucide-react";

interface VideoCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onLeaveCall: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({
  localStream,
  remoteStream,
  onLeaveCall,
  isAudioEnabled,
  isVideoEnabled,
  toggleAudio,
  toggleVideo,
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50">
      <div className="relative h-full w-full">
        {/* Remote Video (Full Screen) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Local Video (Picture-in-Picture) */}
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-4 right-4 w-48 h-36 rounded-lg border-2 border-white"
        />

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          <Button
            onClick={toggleAudio}
            variant={isAudioEnabled ? "default" : "destructive"}
            size="icon"
            className="rounded-full h-12 w-12"
          >
            {isAudioEnabled ? <Mic /> : <MicOff />}
          </Button>

          <Button
            onClick={toggleVideo}
            variant={isVideoEnabled ? "default" : "destructive"}
            size="icon"
            className="rounded-full h-12 w-12"
          >
            {isVideoEnabled ? <Video /> : <VideoOff />}
          </Button>

          <Button
            onClick={onLeaveCall}
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12"
          >
            <PhoneOff />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
