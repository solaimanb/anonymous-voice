"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, Phone, Send, Undo2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import * as React from "react";
import { io } from "socket.io-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { AuthService } from "@/services/auth.service";
import socket from "@/lib/socket";

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp?: string;
  isActive?: boolean;
  hasHeart?: boolean;
}

export default function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { roomId } = useParams();
  // const { messages: chatMessages, sendMessage } = useChat(roomId as string);
  const [newMessage, setNewMessage] = useState<any>([]);

  const currentActiveUser = AuthService.getStoredUser();
  const [socket, setSocket] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>({
    username: currentActiveUser?.userName,
  });
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (socket && selectedUser && messageInput.trim()) {
      socket.emit("private message", {
        to: selectedUser.username, // Send username
        message: messageInput,
      });

      // Add the message to the local state
      setMessages((prevMessages: any) => [
        ...prevMessages,
        {
          from: socket.id,
          fromUsername: currentUser.username,
          message: messageInput,
        },
      ]);

      setMessageInput("");
    }
  };
  useEffect(() => {
    if (currentUser) {
      const newSocket = io("http://localhost:5000", {
        auth: {
          username: currentUser.username,
        },
      });

      setSocket(newSocket);

      // Listen for user list updates
      newSocket.on("users", (userList) => {
        setUsers(userList);
      });

      // Listen for private messages
      newSocket.on("private message", (data) => {
        console.log("Received private message:", data);
        setMessages((prevMessages: any) => [
          ...prevMessages,
          {
            from: data.from,
            fromUsername: data.fromUsername,
            message: data.message,
          },
        ]);
      });

      // Listen for message sent confirmation
      newSocket.on("message sent", (data) => {
        console.log("Message sent successfully to:", data.to);
      });

      // Listen for private message errors
      newSocket.on("private message error", (error) => {
        console.error("Private message error:", error);
      });

      // Cleanup on component unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [currentUser]);
  if (!currentActiveUser?.userName) {
    return <h1>Loading</h1>;
  }
  console.log(messages);
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex md:w-80 lg:w-96 flex-col border-r">
        <ChatSidebar contacts={users} setSelectedUser={setSelectedUser} />
      </aside>

      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        {/* Chat header */}
        <header className="flex items-center gap-3 p-4 border-b">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              {/* <ChatSidebar contacts={contacts} /> */}
            </SheetContent>
          </Sheet>

          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Lois Griffin" />
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{selectedUser?.username}</h2>
            <p className="text-xs text-muted-foreground truncate">
              Active 9m ago
            </p>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Phone className="h-5 w-5" />
            <span className="sr-only">Call</span>
          </Button>
          <Sheet open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 lg:hidden"
              >
                <span className="sr-only">View profile</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                </svg>
              </Button>
            </SheetTrigger>
            {/* <SheetContent side="right" className="p-0 w-80">
              <UserProfile />
            </SheetContent> */}
          </Sheet>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <AnimatePresence initial={false}>
            {messages.map((message: any) => (
              <motion.div
                // key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "flex mb-4",
                  message?.fromUsername === currentActiveUser?.userName
                    ? "justify-end"
                    : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message?.fromUsername === currentActiveUser?.userName
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <p className="text-sm">{message.message}</p>
                  {/* <span className="text-xs opacity-50 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span> */}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>

        {/* Message input */}
        <footer className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Aa"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
            />
            <Button type="submit" size="icon">
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </footer>
      </main>

      {/* User profile sidebar for larger screens */}
      <aside className="hidden lg:block w-80 xl:w-96 border-l">
        <UserProfile currentUser={currentUser.username} />
      </aside>
    </div>
  );
}

function ChatSidebar({
  contacts,
  setSelectedUser,
}: {
  setSelectedUser: any;
  contacts: any;
}) {
  const currentActiveuser = AuthService.getStoredUser();
  console.log(currentActiveuser?.userName);
  return (
    <>
      <div className="p-4 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="">
            <Undo2 size={20} />
          </Button>
        </Link>

        <h1 className="text-xl font-semibold text-muted-foreground">Chats</h1>
      </div>

      <ScrollArea className="flex-1 border-t mt-3">
        {contacts.map((contact: any, index: number) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              contact.isActive && "bg-accent",
              contact.username === currentActiveuser?.userName && "hidden",
            )}
            onClick={() => setSelectedUser(contact)}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={contact.avatar} alt={contact.username} />
              <AvatarFallback>{contact.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{contact.username}</span>
                {/* {contact.hasHeart && (
                  <Heart className="h-4 w-4 shrink-0 fill-red-500 text-red-500" />
                )}
                {contact.timestamp && (
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">
                    {contact.timestamp}
                  </span>
                )} */}
              </div>
              {/* {contact.lastMessage && (
                <p className="text-sm text-muted-foreground truncate">
                  {contact.lastMessage}
                </p>
              )} */}
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
}

function UserProfile({ currentUser }: { currentUser: string }) {
  return (
    <Card className="h-full rounded-none border-0">
      <div className="flex flex-col items-center p-6 text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="/placeholder.svg" alt="Lois Griffin" />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">{currentUser}</h2>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span>10 min Call</span>
          <span>•</span>
          <span>3:00 pm</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-green-500">Active Now</span>
        </div>
        <div className="grid w-full gap-2 mt-6">
          <Button className="bg-green-500 hover:bg-green-600">Completed</Button>
          <Button variant="destructive">Cancel</Button>
        </div>
      </div>
    </Card>
  );
}
