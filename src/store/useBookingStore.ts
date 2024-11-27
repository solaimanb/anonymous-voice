import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookingState {
  selectedTimeSlot: string | null;
  selectedDate: string | null;
  selectedDuration: string;
  mentorUsername: string | null;
  showPlanDetails: boolean;
  appointmentType: "Booking Call" | "Quick Call" | "Chat";

  setSelectedTimeSlot: (time: string | null) => void;
  setSelectedDate: (date: string | null) => void;
  setShowPlanDetails: (show: boolean) => void;
  setDuration: (duration: string) => void;
  setMentorUsername: (userName: string) => void;
  setAppointmentType: (type: "Booking Call" | "Quick Call" | "Chat") => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      selectedTimeSlot: null,
      selectedDate: null,
      selectedDuration: "10",
      mentorUsername: null,
      showPlanDetails: false,
      appointmentType: "Booking Call",

      setSelectedTimeSlot: (time) => set({ selectedTimeSlot: time }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setShowPlanDetails: (show) => set({ showPlanDetails: show }),
      setDuration: (duration) => set({ selectedDuration: duration }),
      setMentorUsername: (userName) => set({ mentorUsername: userName }),
      setAppointmentType: (type) => set({ appointmentType: type }),
      resetBooking: () =>
        set({
          selectedTimeSlot: null,
          selectedDate: null,
          selectedDuration: "10",
          mentorUsername: null,
          showPlanDetails: false,
          appointmentType: "Booking Call",
        }),
    }),
    {
      name: "booking-storage",
      partialize: (state) => ({
        selectedDuration: state.selectedDuration,
        appointmentType: state.appointmentType,
      }),
    },
  ),
);
