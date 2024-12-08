import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: number;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const groupedMessages = React.useMemo(() => {
    return messages.reduce((groups, message) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup[0].senderId === message.senderId) {
        lastGroup.push(message);
      } else {
        groups.push([message]);
      }
      return groups;
    }, [] as Message[][]);
  }, [messages]);
  return (
    <ScrollArea className="flex-1 p-4 overflow-y-auto">
      <AnimatePresence initial={false}>
        {groupedMessages.map((group) => (
          <motion.div
            key={group[0].id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "flex mb-4",
              group[0].senderId === currentUserId
                ? "justify-end"
                : "justify-start",
            )}
          >
            {group[0].senderId !== currentUserId && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
            <div className="flex flex-col gap-1">
              {group.map((message, messageIndex) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.senderId === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  {messageIndex === group.length - 1 && (
                    <span className="text-xs opacity-50 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {group[0].senderId === currentUserId && (
              <Avatar className="h-8 w-8 ml-2">
                <AvatarImage src="/placeholder-mentor.svg" alt="You" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  );
};

export default MessageList;
