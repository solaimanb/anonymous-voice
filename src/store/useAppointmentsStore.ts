import { create } from "zustand";
import api from "@/config/axios.config";
import { Appointment } from "@/types/appointments.types";

interface AppointmentMeta {
  total: number;
  page: number;
  limit: number;
}

interface AppointmentResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Appointment[];
  meta: AppointmentMeta;
}

interface AppointmentsState {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  fetchAppointments: (filters: {
    status: string;
    types: Array<"Chat" | "Quick Call">;
  }) => Promise<void>;
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
  appointments: [] as Appointment[],
  loading: false,
  error: null,
  fetchAppointments: async (filters) => {
    set({ loading: true });
    try {
      const response = await api.get<AppointmentResponse>(
        "/api/v1/appointments",
        {
          params: filters,
        },
      );
      set({ appointments: response.data.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      set({ error: "Failed to fetch appointments", loading: false });
    }
  },
}));
