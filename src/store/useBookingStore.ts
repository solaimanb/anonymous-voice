import { create } from "zustand";

interface BookingState {
  selectedTimeSlot: string | null;
  selectedDate: string | null;
  showPlanDetails: boolean;
  setSelectedTimeSlot: (time: string | null) => void;
  setSelectedDate: (date: string | null) => void;
  setShowPlanDetails: (show: boolean) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedTimeSlot: null,
  selectedDate: null,
  showPlanDetails: false,
  setSelectedTimeSlot: (time) => set({ selectedTimeSlot: time }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setShowPlanDetails: (show) => set({ showPlanDetails: show }),
  resetBooking: () =>
    set({
      selectedTimeSlot: null,
      selectedDate: null,
      showPlanDetails: false,
    }),
}));
