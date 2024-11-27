import { useState } from "react";
import { useToast } from "./use-toast";
import { AppointmentPayload } from "@/types/plan";
import { AuthService } from "@/services/auth.service";
import { AppointmentService } from "@/services/appointment.service";
import { BookingError } from "@/services/error-handler";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";
import { AxiosError } from "axios";

export const useBookSession = () => {
  const { toast } = useToast();
  const router = useRouter();
  const bookingStore = useBookingStore();
  const [isLoading, setIsLoading] = useState(false);

  const validateBookingData = () => {
    const validationRules = [
      {
        condition: !bookingStore.mentorUsername,
        message: "Mentor username is required",
      },
      {
        condition: !bookingStore.selectedTimeSlot,
        message: "Time slot must be selected",
      },
      {
        condition: !bookingStore.selectedDate,
        message: "Date must be selected",
      },
    ];

    return validationRules
      .filter((rule) => rule.condition)
      .map((rule) => rule.message);
  };

  const bookSession = async () => {
    if (isLoading) return null;
    setIsLoading(true);

    try {
      const currentUser = AuthService.getStoredUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }

      const validationErrors = validateBookingData();
      if (validationErrors.length > 0) {
        throw new BookingError("VALIDATION_ERROR", validationErrors.join(", "));
      }

      const appointmentPayload: AppointmentPayload = {
        appointmentType: bookingStore.appointmentType,
        status: "confirmed",
        content: `${bookingStore.appointmentType} on ${bookingStore.selectedDate} at ${bookingStore.selectedTimeSlot} (${bookingStore.selectedDuration} min)`,
        selectedSlot: {
          time: bookingStore.selectedTimeSlot!,
          isAvailable: true,
        },
        mentorUserName: bookingStore.mentorUsername!,
        menteeUserName: currentUser.userName,
      };

      const response =
        await AppointmentService.createAppointment(appointmentPayload);

      toast({
        title: "Session Booked Successfully!",
        description: `Your ${bookingStore.appointmentType} is scheduled for ${bookingStore.selectedDate} at ${bookingStore.selectedTimeSlot}`,
        duration: 1000,
      });

      return response;
    } catch (error) {
      console.error("Booking Error Caught:", error);

      if (error instanceof AxiosError) {
        console.error("Booking Error Details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during booking";

      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive",
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookSession,
    isLoading,
  };
};
