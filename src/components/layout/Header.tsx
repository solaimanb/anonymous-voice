"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Mail, Bell, User, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
  name: string;
  href: string;
  dropdown?: string[];
};

const navItems: NavItem[] = [
  { name: "About", href: "/about" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Apply", href: "/apply", dropdown: ["Option 1", "Option 2"] },
  { name: "Blog", href: "/blog" },
  { name: "Donate", href: "/donate" },
  { name: "More", href: "#", dropdown: ["FAQ", "Contact"] },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  console.log(handleLogin);

  return (
    <Sheet>
      <header className="sticky top-0 left-0 w-full bg-white py-1 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/images/av.png"
                  alt="AV"
                  width={100}
                  height={100}
                  className="w-auto h-12 sm:h-14"
                />
              </Link>
            </div>
            <nav className="hidden md:flex space-x-4 lg:space-x-8">
              {navItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.dropdown.map((subItem) => (
                          <DropdownMenuItem key={subItem}>
                            <Link
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {subItem}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        pathname === item.href
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" size="icon">
                    <Mail className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="border-soft-paste-hover">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button className="bg-soft-paste">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
            <div className="md:hidden flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center gap-4 text-soft-paste">
                  <Mail size={20} />
                  <Bell size={20} />
                  <SheetTrigger>
                    <Menu size={20} />
                  </SheetTrigger>
                </div>
              ) : (
                <div className="flex items-center text-sm bg-soft-paste text-white font-bold rounded-lg space-x-2 px-4 py-2">
                  <Link href="/login">Login</Link>
                  <span>/</span>
                  <Link href="/signup">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <SheetContent side={"left"} className="p-3 border flex flex-col">
          <SheetHeader className="">
            <SheetTitle className="text-start font-bold text-sm">
              <Image src="/images/av.png" alt="av" width={50} height={50} />
            </SheetTitle>
          </SheetHeader>

          <nav className="mt-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li
                  key={item.href}
                  className="border rounded-md font-bold text-soft-paste-darker"
                >
                  <Link href={item.href} className="block px-2 py-2">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <SheetFooter className="mt-auto">
            <p className="text-center text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Anonymous Voice. All rights
              reserved.
            </p>
          </SheetFooter>
        </SheetContent>
      </header>
    </Sheet>
  );
}
