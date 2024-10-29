"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Phone,
  MessageCircleMore,
  PhoneOutgoing,
} from "lucide-react";
import { SocialBar } from "./SocialBar";

export default function Hero() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-400 via-purple-300 to-blue-300">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/av-hero.webp"
          alt=""
          layout="fill"
          // width={1920}
          // height={1080}
          objectFit="cover"
          className="object-center"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16 text-center text-white md:px-8 lg:px-16">
        <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          Find Peace and Support For Your Mental Health
        </h1>
        <p className="mb-8 lg:max-w-3xl">
          Take a step towards mental clarity and well-being in a supportive,
          peaceful environment.{" "}
          <span className="hidden lg:block">
            Start your journey with compassionate care, tailored to your unique
            needs.
          </span>
        </p>

        <div className="flex items-center w-full gap-4 flex-row md:justify-center">
          <Button className="w-full md:w-auto bg-soft-paste text-white font-bold">
            <MessageCircleMore />
            Chat Now
          </Button>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full md:w-auto bg-violet text-white font-bold"
              >
                Make A Call
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full md:w-auto space-y-2 py-5 px-3 font-bold bg-violet">
              <DropdownMenuItem className="cursor-pointer bg-soft-paste text-white px-4 lg:px-1">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer bg-soft-paste text-white px-4 lg:px-1">
                <PhoneOutgoing className="w-4 h-4 mr-2" />
                Book A Call
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden lg:block mt-4">
          <p className="text-sm">
            “Take a step towards mental clarity and well-being in a supportive”
          </p>
        </div>

        <SocialBar />
      </div>
    </section>
  );
}
