import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Undo2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";

interface ChatContact {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp?: string;
  isActive?: boolean;
  hasHeart?: boolean;
}

interface ChatSidebarProps {
  contacts: ChatContact[];
  setSelectedUser: React.Dispatch<React.SetStateAction<ChatContact | null>>;
  selectedUser: ChatContact | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  contacts,
  setSelectedUser,
  selectedUser,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentActiveuser = AuthService.getStoredUser();

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has("user")) {
      router.replace("/chat");
    }
  }, [router, searchParams]);

  const handleUserSelect = (contact: ChatContact) => {
    setSelectedUser(contact);
    const params = new URLSearchParams(searchParams.toString());
    params.set("user", contact.username);
    router.push(`/chat?${params.toString()}`);
  };

  return (
    <>
      <div className="p-2.5 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="">
            <Undo2 size={20} />
          </Button>
        </Link>

        <h1 className="text-xl font-semibold text-muted-foreground">Chats</h1>
      </div>

      <ScrollArea className="flex-1 border-t mt-3">
        {contacts.map((contact, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-muted/40",
              contact.isActive && "bg-accent",
              contact.username === currentActiveuser?.userName && "hidden",
              selectedUser?.username === contact.username && "bg-blue-100",
            )}
            onClick={() => handleUserSelect(contact)}
          >
            <Avatar className="w-8 h-8 border rounded-full">
              <AvatarImage src={contact.avatar} alt={contact.username} />
              <AvatarFallback>{contact.username.charAt(0)}</AvatarFallback>
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
};

export default React.memo(ChatSidebar);
