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
import { motion } from "framer-motion";

const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  tap: {
    scale: 0.95,
  },
};

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Hero() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <section className="relative lg:min-h-[90vh] flex justify-center items-center overflow-hidden bg-gradient-to-b from-purple-400 via-purple-300 to-blue-300">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/av-hero.webp"
          alt="A serene landscape representing mental health support"
          width={1920}
          height={1080}
          className="object-center w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 py-20 md:px-8 lg:px-16">
        <motion.h1
          variants={textVariants}
          initial="initial"
          animate="animate"
          className="mb-4 text-3xl font-bold leading-tight md:text-5xl lg:text-6xl"
        >
          Find Peace and Support For Your Mental Health
        </motion.h1>
        <motion.p
          variants={textVariants}
          initial="initial"
          animate="animate"
          className="mb-8 text-sm lg:max-w-3xl font-semibold"
        >
          Take a step towards mental clarity and well-being in a supportive,
          peaceful environment.{" "}
          <span className="hidden lg:block">
            Start your journey with compassionate care, tailored to your unique
            needs.
          </span>
        </motion.p>

        <div className="flex items-center w-full gap-4 flex-row justify-center">
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button className="w-full md:w-auto bg-soft-paste text-white font-bold">
              <MessageCircleMore />
              Chat Now
            </Button>
          </motion.div>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button className="w-full md:w-auto bg-violet text-white font-bold">
                  Make A Call
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full md:w-auto space-y-2 py-3 px-2 font-bold bg-violet">
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
