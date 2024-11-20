import { z } from "zod";

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
