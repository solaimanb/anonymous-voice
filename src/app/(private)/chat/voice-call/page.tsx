"use client";

import * as React from "react";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { AuthService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PhoneOff } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const VoiceCallPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  console.log("Pathname:", pathname);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const currentActiveUser = AuthService.getStoredUser();
    if (!currentActiveUser || !currentActiveUser.userName) {
      throw new Error("User is not authenticated or username is missing");
    }

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: {
        username: currentActiveUser.userName,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("join room", { pathname });
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [pathname]);

  const handleLeaveCall = () => {
    if (socket) {
      socket.emit("leave room", { pathname });
      router.push("/chat");
    }
  };

  if (!isConnected) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src="/images/avatar.png" alt="Caller" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <p className="text-lg font-semibold">Voice Call</p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button onClick={handleLeaveCall} variant="destructive">
            <PhoneOff className="mr-2 h-4 w-4" />
            Leave Call
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VoiceCallPage;
