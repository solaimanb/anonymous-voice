"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Heart, Menu, Phone, Send, Undo2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useChat } from "@/hooks/useChat";

interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "them";
  timestamp: Date;
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp?: string;
  isActive?: boolean;
  hasHeart?: boolean;
}

export default function ResponsiveChatInterface() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "1",
      content:
        "Hahaha it's all good! I'm here another 10 days. Just house/dog sitting today through Saturday still. Then here another week after that before I come home.",
      sender: "them",
      timestamp: new Date(),
    },
    {
      id: "2",
      content:
        "Nice! Let's try and grab lunch next week. What's in Colorado for you?",
      sender: "user",
      timestamp: new Date(),
    },
    {
      id: "3",
      content: "Peter, you know my family lives here.",
      sender: "them",
      timestamp: new Date(),
    },
    {
      id: "4",
      content:
        "You're welcome to join me next time. It would be nice for you to see them. It's been years. But you need to behave...",
      sender: "them",
      timestamp: new Date(),
    },
    {
      id: "5",
      content: "Gosh, it's not like me to do anything crazy or stupid.",
      sender: "user",
      timestamp: new Date(),
    },
  ]);

  const contacts: ChatContact[] = [
    {
      id: "1",
      name: "Adam West",
      avatar: "/placeholder.svg",
      lastMessage: "",
      timestamp: "4d",
      hasHeart: true,
    },
    {
      id: "2",
      name: "Brian Griffin",
      avatar: "/placeholder.svg",
      lastMessage: "Yay, this will be the best....",
    },
    {
      id: "3",
      name: "Lois Griffin",
      avatar: "/placeholder.svg",
      lastMessage: "Yay, this will be the best....",
      isActive: true,
    },
  ];

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const { roomId } = useParams();
  const { messages, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = React.useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage(newMessage);
    setNewMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now().toString(),
        content: newMessage,
        sender: "user",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex md:w-80 lg:w-96 flex-col border-r">
        <ChatSidebar contacts={contacts} />
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
              <ChatSidebar contacts={contacts} />
            </SheetContent>
          </Sheet>

          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Lois Griffin" />
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">Lois Griffin</h2>
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
            <SheetContent side="right" className="p-0 w-80">
              <UserProfile />
            </SheetContent>
          </Sheet>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "flex mb-4",
                  message.sender === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-50 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
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
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
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
        <UserProfile />
      </aside>
    </div>
  );
}

function ChatSidebar({ contacts }: { contacts: ChatContact[] }) {
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
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
              contact.isActive && "bg-accent",
            )}
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={contact.avatar} alt={contact.name} />
              <AvatarFallback>{contact.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{contact.name}</span>
                {contact.hasHeart && (
                  <Heart className="h-4 w-4 shrink-0 fill-red-500 text-red-500" />
                )}
                {contact.timestamp && (
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">
                    {contact.timestamp}
                  </span>
                )}
              </div>
              {contact.lastMessage && (
                <p className="text-sm text-muted-foreground truncate">
                  {contact.lastMessage}
                </p>
              )}
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
}

function UserProfile() {
  return (
    <Card className="h-full rounded-none border-0">
      <div className="flex flex-col items-center p-6 text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="/placeholder.svg" alt="Lois Griffin" />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">Lois Griffin</h2>
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
