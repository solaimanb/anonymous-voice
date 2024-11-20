import { BookingSchema } from "@/types/booking";
import type { Booking } from "@/types/booking";

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const response = await fetch(
      "https://run.mocky.io/v3/f91d4a28-c79f-4aba-8ee0-64d89351b418",
    );
    if (!response.ok) {
      throw new APIError(
        "Failed to fetch bookings",
        response.status,
        "FETCH_ERROR",
      );
    }
    const data = await response.json();
    console.log("Fetched data:", data);
    return BookingSchema.array().parse(data);
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Failed to process bookings data",
      500,
      "PROCESSING_ERROR",
    );
  }
};

// Define the updateBookingStatus function
export async function updateBookingStatus(
  bookingId: string,
  status: string,
): Promise<void> {
  // Implement the function logic here
  // For example, make an API call to update the booking status
  const response = await fetch(`/api/bookings/${bookingId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update booking status");
  }
}

// import { BookingSchema } from "@/types/booking";
// import type { Booking } from "@/types/booking";

// export class APIError extends Error {
//   constructor(
//     message: string,
//     public status: number,
//     public code: string
//   ) {
//     super(message);
//     this.name = "APIError";
//   }
// }

// export const fetchBookings = async (): Promise<Booking[]> => {
//   try {
//     const response = await fetch("/api/bookings");
//     if (!response.ok) {
//       throw new APIError(
//         "Failed to fetch bookings",
//         response.status,
//         "FETCH_ERROR"
//       );
//     }
//     const data = await response.json();
//     return BookingSchema.array().parse(data);
//   } catch (error) {
//     if (error instanceof APIError) throw error;
//     throw new APIError(
//       "Failed to process bookings data",
//       500,
//       "PROCESSING_ERROR"
//     );
//   }
// };

// export const updateBookingStatus = async (
//   bookingId: string,
//   status: Booking["status"]
// ): Promise<Booking> => {
//   try {
//     const response = await fetch(`/api/bookings/${bookingId}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status }),
//     });

//     if (!response.ok) {
//       throw new APIError(
//         "Failed to update booking",
//         response.status,
//         "UPDATE_ERROR"
//       );
//     }

//     const data = await response.json();
//     return BookingSchema.parse(data);
//   } catch (error) {
//     if (error instanceof APIError) throw error;
//     throw new APIError(
//       "Failed to process update request",
//       500,
//       "PROCESSING_ERROR"
//     );
//   }
// };
