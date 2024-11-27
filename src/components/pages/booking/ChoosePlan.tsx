"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBookingStore } from "@/store/useBookingStore";
import { useBookingLogic } from "@/hooks/booking/useBookingLogic";
import { PlanField } from "./_components/PlanField";
import { calculateValidity, formatDateToLocale } from "@/lib/date";
import { ChoosePlanProps } from "@/types/booking";

export default function ChoosePlan({ mentorUsername }: ChoosePlanProps) {
  const setMentorUsername = useBookingStore((state) => state.setMentorUsername);
  const selectedTimeSlot = useBookingStore((state) => state.selectedTimeSlot);
  const selectedDate = useBookingStore((state) => state.selectedDate);

  const {
    duration,
    isLoading,
    showConfirmDialog,
    setShowConfirmDialog,
    handleDurationChange,
    handleConfirmBooking,
    isBookingDisabled,
  } = useBookingLogic(mentorUsername);

  useEffect(() => {
    setMentorUsername(mentorUsername);
  }, [mentorUsername, setMentorUsername]);

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
          <PlanField label="Date" value={formatDateToLocale(selectedDate)} />
          <PlanField label="Validity" value={calculateValidity()} />
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
                  {formatDateToLocale(selectedDate)} at {selectedTimeSlot}.
                  Would you like to proceed?
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
