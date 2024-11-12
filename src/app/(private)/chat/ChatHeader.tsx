import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatSidebar } from "./ChatSidebar";

export function ChatHeader({
  isSidebarOpen,
  setIsSidebarOpen,
  contactName,
  lastActiveTime,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contactName: string;
  lastActiveTime: string;
}) {
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
          <ChatSidebar contacts={[]} />
        </SheetContent>
      </Sheet>

      <Avatar className="h-10 w-10">
        <AvatarImage src="/placeholder.svg" alt={contactName} />
        <AvatarFallback>{contactName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold truncate">{contactName}</h2>
        <p className="text-xs text-muted-foreground truncate">
          Active {lastActiveTime} ago
        </p>
      </div>
      <Button variant="ghost" size="icon" className="shrink-0">
        <Phone className="h-5 w-5" />
        <span className="sr-only">Call</span>
      </Button>
    </header>
  );
}
