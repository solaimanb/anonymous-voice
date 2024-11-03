"use client";

import WhatToExpect from "@/components/pages/howitworks/WhatToExpect";
import { motion } from "framer-motion";
import {
  User,
  HandshakeIcon,
  MessageSquare,
  FileText,
  Heart,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: JSX.Element;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Sign Up / Log In",
    description:
      "Create a free, anonymous account in a few easy steps, to get full access.",
    icon: <User className="w-6 h-6" />,
  },
  {
    id: 2,
    title: "Connect with a Volunteer",
    description: "Get matched with a trained volunteer based on your needs.",
    icon: <HandshakeIcon className="w-6 h-6" />,
  },
  {
    id: 3,
    title: "Begin Your Journey",
    description:
      "Start conversations and receive compassionate mental health support.",
    icon: <MessageSquare className="w-6 h-6" />,
  },
  {
    id: 4,
    title: "Access Resources",
    description: "Browse articles, mental health resources, and helpful tools.",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 5,
    title: "Get Ongoing Support",
    description:
      "Continue your journey with ongoing volunteer support or expert referrals.",
    icon: <Heart className="w-6 h-6" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Component() {
  return (
    <div className="w-full">
      <section className="w-full bg-[url('/texture-bg.png')] bg-cover bg-center">
        {/* Top Banner */}
        <div className="w-full bg-[#8CD7D0] relative py-4">
          <div className="absolute top-0 left-0 w-24 h-24 bg-[url('/leaf-decoration.svg')] opacity-30" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-[url('/leaf-decoration.svg')] opacity-30 transform scale-x-[-1]" />
          <h2 className="text-white text-2xl font-medium text-center">
            Easy Steps to Access Support
          </h2>
        </div>

        <div className="container max-w-2xl mx-auto px-4 py-12">
          {/* Subtitle */}
          <div className="text-center mb-8">
            <h3 className="text-[#A393EB] text-2xl font-medium mb-4">
              Step-by-Step Guideline
            </h3>
            <div className="inline-flex items-center bg-[#8CD7D0] rounded-full px-6 py-2 text-white">
              Follow These Simple Steps 👋
            </div>
          </div>

          {/* Steps */}
          <motion.div
            className="space-y-12 mt-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true }}
          >
            {steps.map((step) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center text-center"
                variants={itemVariants}
              >
                <div className="rounded-lg border-2 border-[#A393EB] px-6 py-1 text-[#A393EB] font-medium mb-4">
                  Step {step.id}
                </div>
                <div className="w-16 h-16 rounded-full bg-[#8CD7D0]/20 flex items-center justify-center text-[#8CD7D0] mb-4">
                  {step.icon}
                </div>
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-gray-600 max-w-md">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section>
        <WhatToExpect />
      </section>
    </div>
  );
}
