"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import MessageList from "./_components/MessageList";
import CallInterface from "./_components/CallInterface";
import ChatHeader from "./_components/ChatHeader";
import { ChatMessage, ChatUser, Message } from "@/types/chat.types";
import MessageInput from "./_components/MessageInput";
import Loading from "@/app/loading";

interface ChatState {
  isLoading: boolean;
  error: string | null;
}

export default function OneToOneChatInterface() {
  const { user: currentUser } = useAuth();
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    isLoading: true,
    error: null,
  });
  const { userId } = useParams();
  const { messages: chatMessages, sendMessage } = useChat(userId as string);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setChatState({ isLoading: false, error: null });
      } catch (error) {
        setChatState({ isLoading: false, error: "Failed to load chat data" });
        console.log("Failed to fetch chat data:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const mockUserData: ChatUser = {
          id: String(userId),
          name: "Griffin",
          avatar: "/placeholder.svg",
          status: "online",
          lastActive: "9m ago",
          email: "griffin@example.com",
        };
        setChatUser(mockUserData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (userId) {
      fetchChatData();
      fetchUserData();
    }
  }, [userId]);

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  if (chatState.isLoading || !chatUser) {
    return <Loading />;
  }

  if (chatState.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{chatState.error}</p>
      </div>
    );
  }

  // Map ChatMessage to Message
  const messages: Message[] = chatMessages.map((msg: ChatMessage) => ({
    ...msg,
    timestamp: new Date(msg.timestamp).getTime(),
  }));

  return (
    <div className="flex min-h-screen bg-background">
      <main className="lg:w-3/4 flex-1 flex flex-col">
        <ChatHeader
          user={chatUser}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
        />

        <MessageList
          messages={messages}
          currentUserId={currentUser?.id || ""}
        />

        <MessageInput onSendMessage={handleSendMessage} />
      </main>

      <CallInterface user={chatUser} />
    </div>
  );
}
