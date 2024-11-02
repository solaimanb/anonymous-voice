import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

export const ChatSidebar = ({ chats, activeChat, onChatSelect }: {
  chats: Array<{
    id: string;
    name: string;
    avatar: string;
    lastMessage?: string;
    hasHeart?: boolean;
    time?: string;
  }>;
  activeChat?: string;
  onChatSelect: (chatId: string) => void;
}) => {
  return (
    <div className="w-72 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-gray-400 text-lg">Chats</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50",
                activeChat === chat.id && "bg-blue-50"
              )}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center">
                  <p className="font-medium text-gray-900 truncate">
                    {chat.name}
                  </p>
                  {chat.hasHeart && (
                    <Heart className="h-4 w-4 ml-2 text-red-500 fill-current" />
                  )}
                  {chat.time && (
                    <span className="ml-auto text-xs text-gray-500">
                      {chat.time}
                    </span>
                  )}
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
