"use client";

import { motion } from "framer-motion";
import { Shield, Heart, Lightbulb, Clock, FileText } from "lucide-react";

interface ExpectationCard {
  id: number;
  title: string;
  icon: JSX.Element;
}

const expectations: ExpectationCard[] = [
  {
    id: 1,
    title: "Confidentiality & Privacy",
    icon: <Shield className="w-8 h-8" />,
  },
  {
    id: 2,
    title: "Empathy & Compassion",
    icon: <Heart className="w-8 h-8" />,
  },
  {
    id: 3,
    title: "Expert Guidance",
    icon: <Lightbulb className="w-8 h-8" />,
  },
  {
    id: 4,
    title: "Flexible Support",
    icon: <Clock className="w-8 h-8" />,
  },
  {
    id: 5,
    title: "Resources & Referrals",
    icon: <FileText className="w-8 h-8" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function WhatToExpect() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-3xl font-medium text-center text-[#A393EB] mb-12">
          What to Expect From Us
        </h2>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
        >
          {expectations.map((card) => (
            <motion.div
              key={card.id}
              className="flex flex-col items-center"
              variants={itemVariants}
            >
              <div className="rounded-2xl border border-[#8CD7D0]/30 p-1 mb-4 w-full max-w-[200px]">
                <div className="aspect-square rounded-xl bg-[#8CD7D0]/20 flex items-center justify-center text-[#8CD7D0]">
                  {card.icon}
                </div>
              </div>
              <h3 className="text-center text-sm font-medium text-gray-700">
                {card.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
