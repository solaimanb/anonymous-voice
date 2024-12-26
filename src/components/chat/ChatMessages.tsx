import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { cn } from "@/lib/utils";

interface currentMentorUser {
  username: string;
  role: string;
}

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

interface ChatMessagesProps {
  selectedUser: ChatContact | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  messages: Message[];
  currentUser: currentMentorUser;
  currentActiveUser: { userName: string };
  handleSendMessage: (e: React.FormEvent) => void;
  messageInput: string;
  setMessageInput: React.Dispatch<React.SetStateAction<string>>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onPhoneClick: () => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  selectedUser,
  isSidebarOpen,
  setIsSidebarOpen,
  isProfileOpen,
  setIsProfileOpen,
  isLoading,
  messages,
  currentUser,
  handleSendMessage,
  messageInput,
  setMessageInput,
  messagesEndRef,
  currentActiveUser,
  onPhoneClick,
}) => {
  return (
    <main className="flex-1 flex flex-col">
      {selectedUser ? (
        <>
          {/* Chat header */}
          <ChatHeader
            selectedUser={selectedUser}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isProfileOpen={isProfileOpen}
            setIsProfileOpen={setIsProfileOpen}
            currentUser={currentUser}
            onPhoneClick={onPhoneClick}
          />

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <AnimatePresence initial={false}>
                {Array.isArray(messages) &&
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={cn(
                        "flex mb-4",
                        message?.sentBy === currentActiveUser?.userName
                          ? "justify-end"
                          : "justify-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2",
                          message?.sentBy === currentActiveUser?.userName
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
                <div ref={messagesEndRef} />
              </AnimatePresence>
            )}
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
        </>
      ) : (
        <div className="flex items-center justify-center flex-1">
          <h2 className="text-xl font-semibold text-muted-foreground">
            Please select a user to start conversation
          </h2>
        </div>
      )}
    </main>
  );
};

export default ChatMessages;
