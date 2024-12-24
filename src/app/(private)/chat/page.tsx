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
import { ChatMessage, Message } from "@/types/chat.types";
import { useChatStore } from "@/store/useChatStore";
import { ChatService } from "@/services/chat.service";

interface ChatUser {
  key: string;
  username: string;
  avatar?: string;
  isActive?: boolean;
  avatarUrl?: string;
  appointmentDuration?: string;
  appointmentTime?: string;
}

const SOCKET_SERVER =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

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
            {selectedUser?.username?.charAt(0).toUpperCase() || "U"}
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
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<ChatUser | null>(null);
  const [messageInput, setMessageInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const {
    messages,
    addMessage,
    setActiveRoom,
    activeRoomId,
    setOnlineUsers,
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

  React.useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError(undefined);
        const roomId = activeRoomId;
        if (roomId && selectedUser) {
          const appointment = {
            mentorUserName:
              user?.role === "mentor"
                ? currentUser.username
                : selectedUser.username,
            menteeUserName:
              user?.role === "mentee"
                ? currentUser.username
                : selectedUser.username,
            _id: roomId,
          };
          await ChatService.initializeSession(appointment);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [activeRoomId, selectedUser, user?.role, currentUser?.username]);

  const handleUserSelect = React.useCallback(
    (user: ChatUser) => {
      const roomId = [currentUser.username, user.username].sort().join("-");
      setActiveRoom(roomId);
      setSelectedUser(user);
    },
    [currentUser.username, setActiveRoom],
  );

  const handleSendMessage = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!socket || !selectedUser || !messageInput.trim() || !activeRoomId)
        return;

      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        content: messageInput.trim(),
        senderId: socket.id || "",
        from: socket.id || "",
        fromUsername: currentUser.username || "",
        message: messageInput.trim(),
        timestamp: Date.now(),
        status: "sent",
        roomId: activeRoomId,
      };

      socket.emit("private message", {
        to: selectedUser.username,
        message: messageInput.trim(),
        roomId: activeRoomId,
      });

      try {
        await ChatService.sendMessage(activeRoomId, {
          content: messageInput.trim(),
          fromUsername: currentUser.username,
          sentTo: selectedUser.username,
          message: messageInput.trim(),
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }

      addMessage(activeRoomId, newMessage);
      setMessageInput("");
    },
    [socket, selectedUser, messageInput, activeRoomId, addMessage, currentUser],
  );

  const handleComplete = React.useCallback(() => {
    if (selectedUser) {
      // Update the status to 'completed' (you might need to call an API here)
      // For now, we'll just remove the user from the sidebar
      removeUserFromSidebar(selectedUser.username);
      setSelectedUser(null);
    }
  }, [selectedUser, removeUserFromSidebar]);

  React.useEffect(() => {
    if (!currentUser.username) return;

    const newSocket = io(SOCKET_SERVER, {
      auth: { username: currentUser.username },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected");
    });

    newSocket.on("users", (users: ChatUser[]) => {
      setOnlineUsers(users.map((user) => user.username));
    });

    newSocket.on("private message", (data: Message) => {
      const activeRoom = useChatStore.getState().activeRoomId;
      if (data.roomId === activeRoom) {
        addMessage(activeRoom, {
          ...data,
          timestamp: data.timestamp || Date.now(),
          status: data.status || "delivered",
        });
      }
    });

    newSocket.on("chat:typing", ({ roomId, isTyping }) => {
      if (roomId === activeRoomId) {
        useChatStore.getState().setTypingStatus(roomId, isTyping);
      }
    });

    newSocket.on("chat:status", ({ roomId, messageId, status }) => {
      if (roomId === activeRoomId) {
        useChatStore.getState().updateMessageStatus(roomId, messageId, status);
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setError("Socket connection error");
    });

    newSocket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
      setError("Socket disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [currentUser.username, setOnlineUsers, addMessage, activeRoomId]);

  const currentMessages = React.useMemo(() => {
    if (!activeRoomId || !Array.isArray(messages[activeRoomId])) return [];
    return messages[activeRoomId].map((message) => ({
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
                  {selectedUser?.username?.charAt(0).toUpperCase() || "U"}
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
              isLoading={isLoading}
              error={error}
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
