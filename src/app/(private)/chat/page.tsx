"use client";

import * as React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
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
import { useChatContactsStore } from "@/store/chat-contacts.store";
import { useChatStore } from "@/store/useChatStore";
import { ChatContact } from "@/types/chat.types";

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
  const { appointments, refetch } = useAppointments();
  const { setFilteredContacts } = useChatContactsStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [incomingCall, setIncomingCall] = useState<CallInvitation | null>(null);
  const { addMessage } = useChatStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const currentActiveUser = useMemo(() => AuthService.getStoredUser(), []);
  const currentUser = useMemo(
    () => ({
      username: currentActiveUser?.userName || "",
      role: currentActiveUser?.role || "",
    }),
    [currentActiveUser],
  );

  const filteredContacts = useMemo(() => {
    if (!currentActiveUser?.userName) return [];

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
        mentorUserName: appointment.mentorUserName,
      }));

    const uniqueConfirmedAppointments = Array.from(
      new Set(confirmedAppointments.map((a) => a.username)),
    )
      .map((username) =>
        confirmedAppointments.find((a) => a.username === username),
      )
      .filter((contact): contact is ChatContact => contact !== undefined);

    return currentUser.role === "mentee"
      ? uniqueConfirmedAppointments.filter(
          (contact) =>
            contact.username ===
            appointments.find(
              (appointment) =>
                appointment.menteeUserName === currentUser.username,
            )?.mentorUserName,
        )
      : uniqueConfirmedAppointments;
  }, [appointments, currentUser.role, currentUser.username, currentActiveUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !selectedUser || !messageInput.trim()) return;

    const newMessage = {
      id: `${Date.now()}`,
      sentBy: currentUser.username,
      sentTo: selectedUser.username,
      message: messageInput,
      isSeen: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    socket.emit("private message", {
      to: selectedUser.username,
      message: messageInput,
    });

    setMessages((prev) => [...prev, newMessage]);
    addMessage(newMessage);

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
  };

  useEffect(() => {
    setFilteredContacts(filteredContacts);
  }, [filteredContacts, setFilteredContacts]);

  useEffect(() => {
    if (!currentUser.username) return;

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { username: currentUser.username },
    });

    setSocket(newSocket);

    newSocket.on("users", (userList: ChatContact[]) => {
      setUsers(userList);
      setIsLoading(false);
    });

    newSocket.on("private message", (data: ReceivedMessage) => {
      if (
        selectedUser &&
        (data.fromUsername === selectedUser.username ||
          data.toUsername === selectedUser.username)
      ) {
        setMessages((prev) => [
          ...prev,
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

    newSocket.on("private message error", (error: Error) => {
      console.error("Private message error:", error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser.username, selectedUser]);

  const fetchMessages = React.useCallback(
    async (page: number) => {
      if (!selectedUser) return;

      setIsLoading(true);
      try {
        const response = await socketService.getMessagesByUsername(
          selectedUser.username,
          page,
        );
        console.log("API Response:", response.data);
        const filteredMessages = response.data.filter(
          (message) =>
            (message.sentBy === currentUser.username &&
              message.sentTo === selectedUser.username) ||
            (message.sentBy === selectedUser.username &&
              message.sentTo === currentUser.username),
        );
        setMessages((prev) => [...filteredMessages.reverse(), ...prev]);
        if (response.meta) {
          setHasMore(response.meta.page < response.meta.total);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedUser, currentUser.username],
  );

  useEffect(() => {
    fetchMessages(page);
  }, [selectedUser, currentUser.username, page, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    CallService.listenForCallInvitations(
      socket,
      (invitation: CallInvitation) => {
        setIncomingCall(invitation);
      },
    );

    socket.on("call:accept", ({ roomId }) => {
      router.push(`/chat/video-call?roomId=${roomId}&caller=false`);
    });

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
      type: "audio",
    };
    CallService.sendCallInvitation(socket, invitation);
    router.push(`/chat/video-call?roomId=${roomId}&caller=true`);
  };

  if (!currentActiveUser?.userName) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden md:flex w-full max-w-[20vw] flex-col border-r">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ChatSidebar
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        )}
      </aside>

      <ChatMessages
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
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
        onLoadMore={() => setPage((prev) => prev + 1)}
        hasMore={hasMore}
      />

      {selectedUser && currentUser.role === "mentor" && (
        <aside className="hidden lg:block w-80 xl:w-96 border-l">
          <UserProfile
            selectedUser={selectedUser}
            onStatusUpdate={() => {
              setSelectedUser(null);
              refetch();
            }}
          />
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
