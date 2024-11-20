import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import { UserRole } from "@/types/user.types";

// Define dropdown items for each role
const roleDropdownItems = {
  mentee: [{ label: "Settings", href: "/settings" }],
  mentor: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: "/settings" },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: "/settings" },
    { label: "User Management", href: "/admin/users" },
    { label: "Analytics", href: "/admin/analytics" },
  ],
};

interface UserDropdownProps {
  user: {
    role: UserRole;
    logout: () => void;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const dropdownItems = roleDropdownItems[user.role] || [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User size={22} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {dropdownItems.map((item) => (
          <DropdownMenuItem key={item.href}>
            <Link href={item.href} className="w-full text-left">
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={user.logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
