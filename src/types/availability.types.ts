export type TimeSlot = {
  id: string;
  time: string;
  isAvailable: boolean;
  selected?: boolean;
};

export type DayAvailability = {
  date: string;
  timeSlots: TimeSlot[];
};

export type MentorAvailability = {
  mentorId: string;
  availabilities: DayAvailability[];
};
