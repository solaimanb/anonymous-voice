import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CallButton } from "../call/call-button";
import { useChatContactsStore } from "@/store/chat-contacts.store";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { AuthService } from "@/services/auth.service";

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

interface ChatHeaderProps {
  selectedUser: ChatContact;
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contactName?: string;
  lastActiveTime?: string;
  currentUser: currentMentorUser;
  onPhoneClick: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedUser,
  isSidebarOpen,
  setIsSidebarOpen,
  lastActiveTime,
  currentUser,
}) => {
  const currentActiveuser = React.useMemo(() => {
    try {
      return AuthService.getStoredUser();
    } catch {
      return null;
    }
  }, []);

  const { filteredContacts } = useChatContactsStore();

  const getEmptyStateMessage = () => {
    if (currentActiveuser?.role === "mentor") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            No Active Mentees
          </p>
          <p className="text-xs text-muted-foreground">
            Wait for mentees to book appointments with you
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          No Active Appointments
        </p>
        <p className="text-xs text-muted-foreground">
          Book an appointment with a mentor to start chatting
        </p>
      </div>
    );
  };

  return (
    <header className="flex items-center gap-3 p-4 border-b">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="py-8 px-0 w-80">
          <ScrollArea className="flex-1 border-t mt-3">
            {filteredContacts.length > 0
              ? filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    role="button"
                    aria-pressed={selectedUser?.username === contact.username}
                    className={cn(
                      "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-muted/40",
                      contact.isActive && "bg-accent",
                      selectedUser?.username === contact.username &&
                        "bg-blue-100",
                    )}
                    // onClick={() => handleUserSelect()}
                  >
                    <Avatar className="w-8 h-8 border rounded-full">
                      <AvatarImage
                        // src={contact.avatar}
                        src="/images/avatar.png"
                        alt={contact.username}
                      />
                      <AvatarFallback>
                        {contact.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {contact.username}
                        </span>
                        {contact.mentorName && (
                          <span className="text-sm text-muted-foreground ml-2">
                            (Mentor: {contact.mentorName})
                          </span>
                        )}
                        {contact.isActive && (
                          <span className="text-xs text-green-500 ml-auto">
                            Active
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
                ))
              : getEmptyStateMessage()}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Avatar className="h-10 w-10">
        <AvatarImage src="/images/avatar.svg" alt={selectedUser.username} />
        <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold truncate">{selectedUser.username}</h2>
        <p className="text-xs text-muted-foreground truncate">
          {lastActiveTime || "Active 9m ago"}
        </p>
      </div>

      {currentUser.role === "mentor" && (
        // <Button
        //   variant="ghost"
        //   size="icon"
        //   className="shrink-0"
        //   onClick={onPhoneClick}
        // >
        //   <Phone className="h-5 w-5" />
        //   <span className="sr-only">Call</span>
        // </Button>
        <CallButton menteeId={selectedUser.id} />
      )}
    </header>
  );
};
