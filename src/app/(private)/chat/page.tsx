"use client";

import * as React from "react";
import { Menu, Phone, Send } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";
import { MessageList } from "@/components/chat/MessageList";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessage, ChatUser, SocketMessage } from "@/types/chat.types";
import { useChatStore } from "@/store/useChatStore";
import { ChatService } from "@/services/chat.service";

const SOCKET_SERVER =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

interface MessageResponse {
  _id: string;
  sentBy: string;
  sentTo: string;
  message: string;
  roomId: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

function UserProfile({
  selectedUser,
  onComplete,
}: {
  selectedUser: ChatUser;
  onComplete: () => void;
}) {
  return (
    <Card className="h-full rounded-none border-0">
      <div className="flex flex-col items-center p-6 text-center">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={selectedUser?.avatarUrl || "/placeholder.svg"}
            alt={selectedUser?.username || "User Avatar"}
          />
          <AvatarFallback className="text-xs">
            {selectedUser?.username?.[0].toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <h2 className="text-xl font-semibold">{selectedUser?.username}</h2>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span>{selectedUser?.appointmentDuration || "N/A"} min Call</span>
          <span>•</span>
          <span>{selectedUser?.appointmentTime || "N/A"}</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`h-2 w-2 rounded-full ${selectedUser?.isActive ? "bg-green-500" : "bg-gray-500"}`}
          />
          <span
            className={`text-sm ${selectedUser?.isActive ? "text-green-500" : "text-gray-500"}`}
          >
            {selectedUser?.isActive ? "Active Now" : "Idle"}
          </span>
        </div>
        <div className="grid w-full gap-2 mt-6">
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={onComplete}
          >
            Completed
          </Button>
          <Button variant="destructive">Cancel</Button>
        </div>
      </div>
    </Card>
  );
}

export default function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<ChatUser | null>(null);
  const [messageInput, setMessageInput] = React.useState("");
  const socketRef = React.useRef<Socket | null>(null);

  const {
    messages,
    addMessage,
    setActiveRoom,
    activeRoomId,
    // setOnlineUsers,
    removeUserFromSidebar,
  } = useChatStore();
  const { user } = useAuth();
  const currentActiveUser = AuthService.getStoredUser();

  const currentUser = React.useMemo(
    () => ({
      username: currentActiveUser?.userName || "",
      id: currentActiveUser?.id || "",
    }),
    [currentActiveUser],
  );

  const handleUserSelect = React.useCallback(
    (user: ChatUser) => {
      const roomId = [currentUser.username, user.username].sort().join("-");
      setActiveRoom(roomId);
      setSelectedUser(user);
      socketRef.current?.emit("room:join", { roomId });

      ChatService.fetchMessages(roomId).then((messages) => {
        const formattedMessages = messages
          .map((msg) => ({
            id: msg._id,
            content: msg.message,
            senderId: msg.sentBy,
            from: msg.sentBy,
            fromUsername: msg.sentBy,
            message: msg.message,
            timestamp: new Date(msg.createdAt).getTime(),
            status: msg.isSeen ? ("read" as const) : ("sent" as const),
            roomId: msg.roomId,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        useChatStore.getState().setMessages(roomId, formattedMessages);
      });
    },
    [currentUser.username, setActiveRoom],
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !socketRef.current ||
      !selectedUser ||
      !messageInput.trim() ||
      !activeRoomId
    )
      return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      content: messageInput.trim(),
      senderId: socketRef.current.id || "",
      from: socketRef.current.id || "",
      fromUsername: currentUser.username || "",
      message: messageInput.trim(),
      timestamp: Date.now(),
      status: "sent",
      roomId: activeRoomId,
    };

    try {
      await ChatService.sendMessage(activeRoomId, newMessage);
      addMessage(activeRoomId, newMessage);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleComplete = React.useCallback(() => {
    if (selectedUser) {
      removeUserFromSidebar(selectedUser.username);
      setSelectedUser(null);
    }
  }, [selectedUser, removeUserFromSidebar]);

  // Update the socket event listener
  // Update the socket event listener with improved real-time handling
  React.useEffect(() => {
    if (!currentUser.username) return;
    socketRef.current?.disconnect();

    const newSocket = io(SOCKET_SERVER, {
      auth: { username: currentUser.username },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    // Enhanced connection status handlers
    newSocket.on("connect", () => {
      console.log("Socket connected with ID:", newSocket.id);
      if (activeRoomId) {
        newSocket.emit("room:join", { roomId: activeRoomId });
        // Fetch initial messages on connection
        handleMessageUpdate();
      }
    });

    const formatMessages = (messages: MessageResponse[]): ChatMessage[] => {
      return messages.map((msg) => ({
        id: msg._id,
        content: msg.message,
        senderId: msg.sentBy,
        from: msg.sentBy,
        fromUsername: msg.sentBy,
        message: msg.message,
        timestamp: new Date(msg.createdAt).getTime(),
        status: msg.isSeen ? "read" : "sent",
        roomId: msg.roomId,
      }));
    };

    // Improved message handlers with immediate updates
    const handleNewMessage = (socketData: SocketMessage) => {
      console.log("Received new message:", socketData);
      if (socketData.type === "message" && socketData.message && activeRoomId) {
        addMessage(activeRoomId, socketData.message);
        // Force refresh messages
        handleMessageUpdate();
      }
    };

    const handleMessageUpdate = async () => {
      if (activeRoomId) {
        const fetchedMessages = await ChatService.fetchMessages(activeRoomId);
        const formattedMessages = formatMessages(fetchedMessages);
        useChatStore.getState().setMessages(activeRoomId, formattedMessages);
      }
    };

    // Listen for both specific room messages and general updates
    newSocket.on(`room:${activeRoomId}`, handleNewMessage);
    newSocket.on("room:message", handleNewMessage);
    newSocket.on("message:new", handleMessageUpdate);

    return () => {
      if (socketRef.current) {
        socketRef.current.off(`room:${activeRoomId}`, handleNewMessage);
        socketRef.current.off("room:message", handleNewMessage);
        socketRef.current.off("message:new", handleMessageUpdate);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [currentUser.username, activeRoomId, addMessage]);

  const currentMessages = React.useMemo(() => {
    if (!activeRoomId || !messages[activeRoomId]) return [];
    return messages[activeRoomId]
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((message) => ({
        ...message,
        from: message.senderId,
      }));
  }, [activeRoomId, messages]);

  if (!currentUser.username) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden md:flex md:w-64 flex-col border-r">
        <ChatSidebar setSelectedUser={handleUserSelect} />
      </aside>

      <main className="flex-1 flex flex-col">
        {selectedUser || user?.role === "mentee" ? (
          <>
            <header className="flex items-center gap-3 p-4 border-b">
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80" />
              </Sheet>

              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={selectedUser?.avatarUrl || "/placeholder.svg"}
                  alt={selectedUser?.username || "User Avatar"}
                />
                <AvatarFallback>
                  {selectedUser?.username?.[0].toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h2 className="font-semibold truncate">
                  {selectedUser?.username || "Chat"}
                </h2>
              </div>

              <Button variant="ghost" size="icon" className="shrink-0">
                <Phone className="h-5 w-5" />
              </Button>
            </header>

            <MessageList
              messages={currentMessages}
              currentUserId={currentUser.username}
              isLoading={false}
              isTyping={false}
              typingUserId={selectedUser?.username || ""}
              roomId={activeRoomId || ""}
            />

            <footer className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type a message"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-muted-foreground">
              {user?.role === "mentor"
                ? "Please select a user to initiate a conversation."
                : "Please select a mentor to initiate a conversation."}
            </p>
          </div>
        )}
      </main>

      {user?.role !== "mentee" && selectedUser && (
        <aside className="hidden lg:block w-80 xl:w-96 border-l">
          <UserProfile
            selectedUser={selectedUser}
            onComplete={handleComplete}
          />
        </aside>
      )}
    </div>
  );
}
