"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { TimeSlot } from "@/types/booking";

interface AvailabilityProps {
  date?: string;
  timeSlots?: TimeSlot[];
  selectedSlot: string | null;
  setSelectedSlot: React.Dispatch<React.SetStateAction<string | null>>;
  onSlotSelect?: (time: string) => void;
}

const TimeSlotItem = ({
  slot,
  selectedSlot,
  setSelectedSlot,
  onSlotSelect,
}: {
  slot: TimeSlot;
  selectedSlot: string | null;
  setSelectedSlot: React.Dispatch<React.SetStateAction<string | null>>;
  onSlotSelect?: (time: string) => void;
}) => (
  <div className="flex items-center justify-between">
    {/* Time Dropdown */}
    <div className="relative">
      <div className="flex items-center gap-2 px-4 py-2 border border-[#7FCCCC]/30 rounded-lg bg-white min-w-[140px]">
        <span className="font-mono text-[#374151]">{slot.time}</span>
        <ChevronDown className="w-4 h-4 text-[#7FCCCC]" />
      </div>
      <div className="absolute bottom-1.5 left-4 right-4 h-px bg-[#7FCCCC]/30" />
    </div>

    {/* Status Badge */}
    <div
      className={`px-6 py-1.5 rounded-md text-white ${
        slot.available ? "bg-[#34D399]" : "bg-[#E5E7EB]"
      }`}
    >
      <span className="text-sm font-medium">
        {slot.available ? "Available" : "Not Available"}
      </span>
    </div>

    {/* Checkbox */}
    <input
      type="checkbox"
      checked={selectedSlot === slot.time}
      onChange={() => {
        if (slot.available) {
          setSelectedSlot(slot.time);
          onSlotSelect?.(slot.time);
        }
      }}
      disabled={!slot.available}
      className="w-5 h-5 rounded-none border-gray-300 text-[#7FCCCC]
                        focus:ring-[#7FCCCC] disabled:opacity-50 cursor-pointer
                        checked:bg-[#7FCCCC] checked:border-[#7FCCCC]"
    />
  </div>
);

export default function Availability({
  date = "17 Oct 2024",
  timeSlots = [
    { time: "1:00 PM", available: true },
    { time: "2:00 PM", available: false },
    { time: "3:00 PM", available: true },
    { time: "4:00 PM", available: false },
    { time: "5:00 PM", available: false },
  ],
  selectedSlot,
  setSelectedSlot,
  onSlotSelect = () => {},
}: AvailabilityProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[#7FCCCC] text-2xl font-normal">Availability</h2>
        <span className="text-[#374151] text-lg">{date}</span>
      </div>
      <div className="h-px bg-[#7FCCCC] mb-6" />

      {/* Time Slots */}
      <div className="space-y-4">
        {timeSlots.map((slot, index) => (
          <TimeSlotItem
            key={index}
            slot={slot}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            onSlotSelect={onSlotSelect}
          />
        ))}
      </div>
    </div>
  );
}
