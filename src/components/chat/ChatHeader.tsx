import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  onPhoneClick,
}) => {
  return (
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
        <AvatarImage src="/placeholder.svg" alt={selectedUser.username} />
        <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold truncate">{selectedUser.username}</h2>
        <p className="text-xs text-muted-foreground truncate">
          {lastActiveTime || "Active 9m ago"}
        </p>
      </div>

      {currentUser.role === "mentor" && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onPhoneClick}
        >
          <Phone className="h-5 w-5" />
          <span className="sr-only">Call</span>
        </Button>
      )}
    </header>
  );
};
