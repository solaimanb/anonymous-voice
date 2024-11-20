import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { CalendarClock, Mail, MessageSquare, User } from "lucide-react";

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

export default function DashboardSidebar() {
  const [activeItem, setActiveItem] = React.useState("Profile");

  return (
    <aside className="hidden w-64 flex-col border-r bg-white md:flex">
      <nav className="flex-1 space-y-2 p-4">
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
    </aside>
  );
}
