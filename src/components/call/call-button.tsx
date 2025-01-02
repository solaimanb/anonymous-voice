"use client";

import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { socket } from "@/lib/webrtc/socket";
import { SOCKET_EVENTS } from "@/lib/webrtc/constants";
import { useChatStore } from "@/store/useChatStore";

export function CallButton() {
  const { toast } = useToast();
  const router = useRouter();
  const { selectedUser, mentor, mentee } = useChatStore();

  const handleCall = () => {
    if (!selectedUser?.id) {
      toast({
        title: "Error",
        description: "No user selected",
        variant: "destructive",
      });
      return;
    }

    const roomId = `call-${Date.now()}`;

    socket.emit(SOCKET_EVENTS.CALL_INITIATE, {
      from: mentor,
      to: mentee,
      fromName: mentor,
      roomId,
    });

    toast({
      title: "Calling...",
      description: `Calling ${selectedUser.username}`,
    });

    socket.once(SOCKET_EVENTS.CALL_ACCEPT, () => {
      router.push(`/call-room/${roomId}`);
    });

    socket.once(SOCKET_EVENTS.CALL_REJECT, () => {
      toast({
        title: "Call rejected",
        description: "User is not available right now",
        variant: "destructive",
      });
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={handleCall}
    >
      <Phone className="h-5 w-5" />
    </Button>
  );
}