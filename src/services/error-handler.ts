import axios, { AxiosError } from "axios";

export class BookingError extends Error {
  constructor(
    public code: string,
    public message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "BookingError";
  }
}

export function handleBookingError(error: Error | AxiosError): BookingError {
  if (axios.isAxiosError(error)) {
    return new BookingError(
      error.response?.status?.toString() || "UNKNOWN",
      error.response?.data?.message || error.message,
      error.response?.data,
    );
  }
  return new BookingError("UNKNOWN", "An unexpected error occurred", error);
}
