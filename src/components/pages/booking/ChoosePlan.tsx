"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanOption } from "@/types/plan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookingStore } from "@/store/useBookingStore";
import { useBookSession } from "@/hooks/useBookSession";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";

interface ChoosePlanProps {
  onPlanSelect?: (plan: PlanOption) => void;
}

interface PlanFieldProps {
  label: string;
  value: string;
  hasDropdown?: boolean;
  onDurationChange?: (value: string) => void;
}

const PlanField = ({
  label,
  value,
  hasDropdown,
  onDurationChange,
}: PlanFieldProps) => {
  if (label === "Call Duration") {
    return (
      <div className="space-y-2 text-sm">
        <label className="block text-soft-paste font-semibold">{label}</label>
        <Select onValueChange={onDurationChange} defaultValue="10">
          <SelectTrigger className="border-soft-paste-light-active">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 min call</SelectItem>
            <SelectItem value="20">20 min call</SelectItem>
            <SelectItem value="30">30 min call</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <label className="block text-soft-paste font-semibold">{label}</label>
      <div className="relative">
        <div className="flex items-center justify-between gap-2 px-4 py-2 border border-soft-paste-light-active rounded-lg">
          <span className="text-soft-paste-darker">{value}</span>
          {hasDropdown && <ChevronDown className="w-4 h-4 text-soft-paste" />}
        </div>
      </div>
    </div>
  );
};

export default function ChoosePlan({
  onPlanSelect = () => {},
}: ChoosePlanProps) {
  const router = useRouter();
  const { selectedTimeSlot, selectedDate, showPlanDetails } = useBookingStore();
  const [duration, setDuration] = useState("10");
  const { bookSession, isLoading } = useBookSession();
  const mentorUsername = "mentorUsername";

  if (!showPlanDetails) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Selected date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      // weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateValidity = () => {
    const now = new Date();
    const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const diffInMs = validUntil.getTime() - now.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(
      (diffInMs % (1000 * 60 * 60)) / (1000 * 60),
    );

    return `${diffInHours}h : ${diffInMinutes}min`;
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
  };

  const handlePlanSelect = async () => {
    const currentUser = AuthService.getStoredUser();

    if (!currentUser) {
      router.push("/login");
      return;
    }

    const plan: PlanOption = {
      type: "call",
      duration: `${duration} min`,
      time: selectedTimeSlot || "",
      date: selectedDate || "",
      validity: calculateValidity(),
    };

    try {
      const bookingResponse = await bookSession(mentorUsername, plan);
      onPlanSelect(plan);
      // TODO: Create a booked calls page and fetch details via API
      // router.push(`/booking/confirmation?id=${bookingResponse.data.id}`);
      console.log("Booking successful:", bookingResponse);
      router.push(`/booking/confirmation/${currentUser.userName}`);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <div className="w-full my-10">
      <h1 className="text-center text-xl md:text-2xl font-bold text-violet-hover mb-8">
        Choose Plan
      </h1>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8 items-end">
          <PlanField
            label="Call Duration"
            value={`${duration} min call`}
            onDurationChange={handleDurationChange}
          />
          <PlanField
            label="Time"
            value={selectedTimeSlot || "Selected time slot"}
          />
          <PlanField label="Date" value={formatDate(selectedDate)} />
          <PlanField label="Validity" value={calculateValidity()} />
          <Button
            onClick={handlePlanSelect}
            disabled={isLoading}
            className="w-full md:w-auto bg-soft-paste hover:bg-soft-paste-active"
          >
            {isLoading ? "Booking..." : "Book The Session"}
          </Button>
        </div>
      </div>
    </div>
  );
}
