import { z } from "zod";
import { PlanOption } from "./plan";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string(),
  avatarUrl: z.string().nullable(),
  email: z.string().email(),
});

export const BookingStatusSchema = z.enum([
  "pending",
  "running",
  "confirmed",
  "completed",
  "cancelled",
]);

export const TimeSlotSchema = z.object({
  time: z.string(),
  available: z.boolean(),
  date: z.string(),
});

export const BookingSchema = z.object({
  id: z.string(),
  user: UserSchema,
  schedule: z.string(),
  duration: z.string(),
  status: BookingStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type TimeSlot = z.infer<typeof TimeSlotSchema>;
export type Booking = z.infer<typeof BookingSchema>;

export const DURATION_OPTIONS = [
  { value: "10", label: "10 min call" },
  { value: "20", label: "20 min call" },
  { value: "30", label: "30 min call" },
] as const;

export interface ChoosePlanProps {
  mentorUsername: string;
  onPlanSelect?: (plan: PlanOption) => void;
}

export interface PlanFieldProps {
  label: string;
  value: string;
  hasDropdown?: boolean;
  onDurationChange?: (value: string) => void;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  duration: string;
  date: string | null;
  timeSlot: string | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
