"use client";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarClock,
  ChevronDown,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  User,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  {
    title: "Booked Calls",
    href: "/dashboard/booked-calls",
    icon: <CalendarClock size={20} />,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: <MessageSquare size={20} />,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: <Mail size={20} />,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <User size={20} />,
  },
];

export default function DashboardHeader() {
  const [activeItem, setActiveItem] = useState("Profile");

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <nav className="flex flex-col gap-4 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-100",
                    activeItem === item.title && "bg-gray-100 font-medium",
                  )}
                  onClick={() => setActiveItem(item.title)}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="text-lg font-semibold">Volunteer Dashboard</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
              <AvatarFallback>V</AvatarFallback>
            </Avatar>
            <ChevronDown className="ml-2 h-4 w-4" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
