"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/chat.types";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoading?: boolean;
  error?: string;
  isTyping?: boolean;
  typingUserId?: string;
  roomId?: string;
}

export const MessageList = React.memo(
  ({
    messages,
    currentUserId,
    isLoading,
    error,
    isTyping,
    typingUserId,
    roomId,
  }: MessageListProps) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const prevMessagesRef = React.useRef(messages);

    React.useEffect(() => {
      if (prevMessagesRef.current.length < messages.length) {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      prevMessagesRef.current = messages;
    }, [messages, roomId]);

    const groupedMessages = React.useMemo(() => {
      return messages.reduce((groups, message) => {
        const lastGroup = groups[groups.length - 1];
        const isSameUser =
          lastGroup && lastGroup[0].fromUsername === message.fromUsername;
        const isWithinTimeWindow =
          lastGroup &&
          message.timestamp - lastGroup[lastGroup.length - 1].timestamp <
            300000;

        if (isSameUser && isWithinTimeWindow) {
          lastGroup.push(message);
        } else {
          groups.push([message]);
        }
        return groups;
      }, [] as ChatMessage[][]);
    }, [messages]);

    if (isLoading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          Loading...
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center text-red-500">
          {error}
        </div>
      );
    }

    return (
      <ScrollArea className="flex-1 py-2 px-4 overflow-y-auto">
        <AnimatePresence mode="popLayout" initial={false}>
          {groupedMessages.map((group, groupIndex) => (
            <motion.div
              key={`${roomId}-group-${groupIndex}-${group[0].fromUsername}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex flex-col gap-2 mb-4",
                group[0].fromUsername === currentUserId
                  ? "items-end"
                  : "items-start",
              )}
            >
              {group.map((message) => (
                <motion.div
                  key={`${roomId}-message-${message.id}-${message.timestamp}`}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.fromUsername === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  <p className="text-sm">{message.message}</p>
                  {/* <span className="text-[9px] tracking-wider font-semibold opacity-50 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span> */}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && typingUserId !== currentUserId && (
          <motion.div initial={false} className="flex items-center gap-2 ml-10">
            <span className="text-sm text-muted-foreground">Typing</span>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex gap-1"
            >
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </motion.div>
          </motion.div>
        )}

        <div ref={scrollRef} />
      </ScrollArea>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.roomId === nextProps.roomId &&
      prevProps.messages.length === nextProps.messages.length &&
      prevProps.isTyping === nextProps.isTyping
    );
  },
);

MessageList.displayName = "MessageList";
