import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";
import { useBookSession } from "@/hooks/useBookSession";
import { useToast } from "@/hooks/use-toast";
import { BookingError } from "@/services/error-handler";

export const useBookingLogic = (mentorUsername: string) => {
  const router = useRouter();
  const bookingStore = useBookingStore();
  const { bookSession, isLoading } = useBookSession();
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [duration, setDuration] = useState(
    bookingStore.selectedDuration || "10",
  );
  console.log("[useBookingLogic] mentorUsername: ", mentorUsername);

  const handleDurationChange = useCallback(
    (value: string) => {
      setDuration(value);
      bookingStore.setDuration(value);
    },
    [bookingStore],
  );

  const handleConfirmBooking = useCallback(async () => {
    try {
      const response = await bookSession();
      if (response?.data?.data._id) {
        bookingStore.resetBooking();
        router.push(
          `/booking/confirmation?status=${response.data.data.status}&user=${response.data.data.menteeUserName}&booking_id=${response.data.data._id}`,
        );
      }
    } catch (error) {
      if (!(error instanceof BookingError)) {
        toast({
          title: "Unexpected Error",
          description: "Failed to complete booking. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setShowConfirmDialog(false);
    }
  }, [bookSession, bookingStore, router, toast]);

  return {
    duration,
    isLoading,
    showConfirmDialog,
    setShowConfirmDialog,
    handleDurationChange,
    handleConfirmBooking,
    isBookingDisabled:
      isLoading || !bookingStore.selectedTimeSlot || !bookingStore.selectedDate,
  };
};
