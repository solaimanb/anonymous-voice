"use client";

import { useState, useMemo, useEffect } from "react";
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
import { BookingError } from "@/services/error-handler";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DURATION_OPTIONS = [
  { value: "10", label: "10 min call" },
  { value: "20", label: "20 min call" },
  { value: "30", label: "30 min call" },
] as const;

interface ChoosePlanProps {
  mentorUsername: string;
  onPlanSelect?: (plan: PlanOption) => void;
}

const PlanField = ({
  label,
  value,
  hasDropdown = false,
  onDurationChange,
}: {
  label: string;
  value: string;
  hasDropdown?: boolean;
  onDurationChange?: (value: string) => void;
}) => {
  if (label === "Call Duration") {
    return (
      <div className="space-y-2 text-sm">
        <label className="block text-soft-paste font-semibold">{label}</label>
        <Select onValueChange={onDurationChange} defaultValue="10">
          <SelectTrigger className="border-soft-paste-light-active">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {DURATION_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
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

export default function ChoosePlan({ mentorUsername }: ChoosePlanProps) {
  const router = useRouter();
  const bookingStore = useBookingStore();
  const { bookSession, isLoading } = useBookSession();
  const [duration, setDuration] = useState(
    bookingStore.selectedDuration || "10",
  );
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    bookingStore.setMentorUsername(mentorUsername);
  }, [mentorUsername, bookingStore]);

  const formatDate = useMemo(
    () => (dateString: string | null) => {
      if (!dateString) return "Selected date";
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    },
    [],
  );

  const validity = useMemo(() => {
    const now = new Date();
    const validUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const diffInMs = validUntil.getTime() - now.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(
      (diffInMs % (1000 * 60 * 60)) / (1000 * 60),
    );
    return `${diffInHours}h : ${diffInMinutes}min`;
  }, []);

  const handleDurationChange = (value: string) => {
    setDuration(value);
    bookingStore.setDuration(value);
  };

  const handleConfirmBooking = async () => {
    try {
      const response = await bookSession();
      if (response?.data?.data._id) {
        bookingStore.resetBooking();
        router.push(
          `/booking/confirmation?status=${response.data.data.status}&user=${response.data.data.menteeUserName}&booking_id=${response.data.data._id}`,
        );
      }
    } catch (error) {
      if (error instanceof BookingError) {
        return;
      }
      toast({
        title: "Unexpected Error",
        description: "Failed to complete booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const isBookingDisabled =
    isLoading || !bookingStore.selectedTimeSlot || !bookingStore.selectedDate;

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
            value={bookingStore.selectedTimeSlot || "Selected time slot"}
          />
          <PlanField
            label="Date"
            value={formatDate(bookingStore.selectedDate)}
          />
          <PlanField label="Validity" value={validity} />
          <Button
            onClick={() => setShowConfirmDialog(true)}
            disabled={isBookingDisabled}
            className="w-full md:w-auto bg-soft-paste hover:bg-soft-paste-active"
          >
            {isLoading ? "Booking..." : "Book The Session"}
          </Button>

          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Booking</DialogTitle>
                <DialogDescription>
                  You are about to book a {duration} minute session for{" "}
                  {formatDate(bookingStore.selectedDate)} at{" "}
                  {bookingStore.selectedTimeSlot}. Would you like to proceed?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmBooking}
                  className="bg-soft-paste hover:bg-soft-paste-active"
                  disabled={isLoading}
                >
                  {isLoading ? "Confirming..." : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
