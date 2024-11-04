"use client";

import { useState } from "react";
import { Star, MessageCircle, Clock, Users, Award } from "lucide-react";
import Availability from "./Availability";
import Image from "next/image";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingDetailsProps {
  name?: string;
  title?: string;
  imageUrl?: string;
  yearsExperience?: number;
  bookingsCompleted?: number;
  expertise?: { name: string }[];
  description?: string;
  date?: string;
  timeSlots?: TimeSlot[];
}

export default function BookingDetailsCard({
  name = "Samuel Beckett",
  title = "Senior Psychologist",
  imageUrl = "/placeholder.svg?height=400&width=400",
  yearsExperience = 5,
  bookingsCompleted = 50,
  expertise = [
    { name: "Social Anxiety" },
    { name: "Insomnia" },
    { name: "Financial" },
  ],
  description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled when an unknown printer took a galley of type and scrambled...",
  date = "17 Oct 2024",
  timeSlots = [
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: false },
    { time: "3:00 PM", available: true },
    { time: "4:00 PM", available: false },
    { time: "5:00 PM", available: false },
  ],
}: BookingDetailsProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <div className="container max-w-7xl mx-auto lg:p-6 xl:px-20">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex gap-4 h-full">
              <div className="w-2/5 bg-muted-foreground/20 rounded-lg">
                <div className="rounded-xl overflow-hidden shrink-0 h-full">
                  <Image
                    src={imageUrl}
                    alt={name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover text-xs"
                  />
                </div>
              </div>

              <div className="w-3/5 flex flex-col justify-between">
                <div>
                  <h2 className="text-[#1F2937] text-xl lg:text-2xl font-bold">
                    {name}
                  </h2>
                  <p className="text-[#6B7280] mt-0.5">{title}</p>
                </div>

                <div>
                  <div className="flex gap-0.5 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[#7FCCCC] fill-[#7FCCCC]"
                      />
                    ))}
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#7FCCCC]" />
                      <span className="text-sm text-[#6B7280]">
                        {yearsExperience}+ Years experience
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#7FCCCC]" />
                      <span className="text-sm text-[#6B7280]">
                        Session Completed ({bookingsCompleted}+)
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {expertise.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-[#7FCCCC]/10 rounded-md"
                      >
                        <Award className="w-3.5 h-3.5 text-[#7FCCCC]" />
                        <span className="text-sm text-[#7FCCCC]">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 h-11 bg-[#7FCCCC] text-white rounded-md flex items-center justify-center gap-2 hover:bg-[#6BBBBB] transition-colors">
                Book Call
              </button>
              <button className="flex-1 h-11 bg-[#B4A5E8] text-white rounded-md flex items-center justify-center gap-2 hover:bg-[#A394D7] transition-colors">
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div>
            <Availability
              date={date}
              timeSlots={timeSlots}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
            <div className="flex gap-3 mt-6">
              <button className="flex-1 h-11 bg-[#7FCCCC] text-white rounded-md flex items-center justify-center gap-2 hover:bg-[#6BBBBB] transition-colors">
                Book A Session
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm text-[#6B7280] leading-relaxed mt-4 pr-6">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
