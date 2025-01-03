"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { AuthService } from "@/services/auth.service";
import { socketService } from "@/services/socket.service";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/app/loading";
import { useAppointments } from "@/hooks/useAppointments";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMessages from "@/components/chat/ChatMessages";
import UserProfile from "@/components/chat/ChatUserProfile";
import { useRouter } from "next/navigation";
import { CallInvitation } from "@/types/call";
import CallInviteDialog from "@/components/chat/CallInviteDialog";
import { CallService } from "@/lib/call/call-service";

interface ChatContact {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp?: string;
  isActive?: boolean;
  hasHeart?: boolean;
}

interface Message {
  id: string;
  sentBy: string;
  sentTo: string;
  message: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReceivedMessage {
  from: string;
  fromUsername: string;
  to: string;
  toUsername: string;
  message: string;
}

export default function ChatInterface() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { appointments } = useAppointments();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [incomingCall, setIncomingCall] = useState<CallInvitation | null>(null);

  console.log("Appointment users:", users);

  const currentActiveUser = AuthService.getStoredUser();
  if (!currentActiveUser || !currentActiveUser.userName) {
    throw new Error("User is not authenticated or username is missing");
  }

  const [currentUser] = useState<{ username: string; role: string }>({
    username: currentActiveUser.userName,
    role: currentActiveUser.role,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (socket && selectedUser && messageInput.trim()) {
      socket.emit("private message", {
        to: selectedUser.username,
        message: messageInput,
      });

      // Add the message to the local state
      setMessages((prevMessages: Message[]) => [
        ...prevMessages,
        {
          id: `${Date.now()}`,
          sentBy: currentUser.username,
          sentTo: selectedUser.username,
          message: messageInput,
          isSeen: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      // Save the message to the database
      try {
        await socketService.saveMessage({
          sentBy: currentUser.username,
          sentTo: selectedUser.username,
          message: messageInput,
          isSeen: false,
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }

      setMessageInput("");
      scrollToBottom();
    }
  };

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        auth: {
          username: currentUser.username,
        },
      });

      setSocket(newSocket);

      // Listen for user list updates
      newSocket.on("users", (userList: ChatContact[]) => {
        setUsers(userList);
        setIsLoading(false);
      });

      // Listen for private messages
      newSocket.on("private message", (data: ReceivedMessage) => {
        if (
          selectedUser &&
          (data.fromUsername === selectedUser.username ||
            data.toUsername === selectedUser.username)
        ) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: `${Date.now()}`,
              sentBy: data.fromUsername,
              sentTo: data.toUsername,
              message: data.message,
              isSeen: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]);
          scrollToBottom();
        }
      });

      // Listen for private message errors
      newSocket.on("private message error", (error: Error) => {
        console.error("Private message error:", error);
      });

      // Cleanup on component unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [currentUser, selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        setIsLoading(true);
        try {
          const response = await socketService.getMessagesByUsername(
            selectedUser.username,
          );
          const filteredMessages = response.data.filter(
            (message) =>
              (message.sentBy === currentUser.username &&
                message.sentTo === selectedUser.username) ||
              (message.sentBy === selectedUser.username &&
                message.sentTo === currentUser.username),
          );
          setMessages(filteredMessages.reverse());
          scrollToBottom();
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle call invitations
  useEffect(() => {
    if (!socket) return;

    CallService.listenForCallInvitations(
      socket,
      (invitation: CallInvitation) => {
        setIncomingCall(invitation);
      },
    );

    // Handle call acceptance
    socket.on("call:accept", ({ roomId }) => {
      router.push(`/chat/video-call?roomId=${roomId}&caller=false`);
    });

    // Handle call rejection
    socket.on("call:reject", () => {
      setIncomingCall(null);
    });

    return () => {
      socket.off("call:accept");
      socket.off("call:reject");
    };
  }, [socket, router]);

  const handleAcceptCall = () => {
    if (!incomingCall || !socket) return;

    CallService.acceptCall(socket, incomingCall.roomId);
    setIncomingCall(null);
    router.push(`/chat/video-call?roomId=${incomingCall.roomId}&caller=false`);
  };

  const handleRejectCall = () => {
    if (!incomingCall || !socket) return;

    CallService.rejectCall(socket, incomingCall.roomId);
    setIncomingCall(null);
  };

  const handlePhoneClick = () => {
    if (!socket || !selectedUser) return;

    const roomId = CallService.generateRoomId();

    const invitation: CallInvitation = {
      roomId,
      from: currentUser.username,
      to: selectedUser.username,
      type: "voice",
    };

    CallService.sendCallInvitation(socket, invitation);
    router.push(`/chat/video-call?roomId=${roomId}&caller=true`);
  };

  if (!currentActiveUser?.userName) {
    return <Loading />;
  }

  // Filter confirmed appointments and map to ChatContact format
  const confirmedAppointments = appointments
    .filter((appointment) => appointment.status === "confirmed")
    .map((appointment) => ({
      id: appointment._id,
      username:
        currentUser.role === "mentor"
          ? appointment.menteeUserName
          : appointment.mentorUserName,
      avatar: "/images/avatar.png",
      lastMessage: "",
    }));

  // Remove duplicate users and filter out undefined values
  const uniqueConfirmedAppointments = Array.from(
    new Set(confirmedAppointments.map((a) => a.username)),
  )
    .map((username) => {
      return confirmedAppointments.find((a) => a.username === username);
    })
    .filter((contact): contact is ChatContact => contact !== undefined);

  // Filter contacts based on user role
  const filteredContacts =
    currentUser.role === "mentee"
      ? uniqueConfirmedAppointments.filter(
          (contact) =>
            contact.username ===
            appointments.find(
              (appointment) =>
                appointment.menteeUserName === currentUser.username,
            )?.mentorUserName,
        )
      : uniqueConfirmedAppointments;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex w-full max-w-[20vw] flex-col border-r">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ChatSidebar
            contacts={filteredContacts}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        )}
      </aside>

      {/* Main chat area */}
      <ChatMessages
        selectedUser={selectedUser}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        isLoading={isLoading}
        messages={messages}
        currentActiveUser={currentActiveUser}
        handleSendMessage={handleSendMessage}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        messagesEndRef={messagesEndRef}
        currentUser={currentUser}
        onPhoneClick={handlePhoneClick}
      />

      {/* User profile sidebar for larger screens */}
      {selectedUser && currentUser.role === "mentor" && (
        <aside className="hidden lg:block w-80 xl:w-96 border-l">
          <UserProfile selectedUser={selectedUser} />
        </aside>
      )}

      {incomingCall && (
        <CallInviteDialog
          isOpen={!!incomingCall}
          onOpenChange={(open) => !open && setIncomingCall(null)}
          caller={incomingCall.from}
          callType={incomingCall.type}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}
    </div>
  );
}
