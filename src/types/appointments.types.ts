export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  _id: string;
}

export interface Appointment {
  _id: string;
  appointmentType: "Chat" | "Quick Call";
  status: "confirmed";
  selectedSlot: TimeSlot[];
  mentorUserName: string;
  menteeUserName: string;
  createdAt: string;
  updatedAt: string;
}
