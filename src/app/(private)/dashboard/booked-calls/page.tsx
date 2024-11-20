"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookingCallsCard } from "../../../../components/cards/BookingCallsCard";
import { useBookings } from "@/hooks/booking/useBookings";

export default function BookedCallsPage() {
  const {
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    handleAccept,
    handleReject,
    handleChat,
  } = useBookings();
  console.log("pendingBookings", pendingBookings);
  console.log("confirmedBookings", confirmedBookings);
  console.log("completedBookings", completedBookings);
  console.log("cancelledBookings", cancelledBookings);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>User Request</CardTitle>
          <CardDescription>Pending call requests from users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingBookings.map((booking) => (
              <BookingCallsCard
                key={booking.id}
                booking={booking}
                onAccept={handleAccept}
                onReject={handleReject}
                isPending
              />
            ))}
            {pendingBookings.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No pending requests
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Confirmed User</CardTitle>
          <CardDescription>List of confirmed and running calls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {confirmedBookings.map((booking) => (
              <BookingCallsCard
                key={booking.id}
                booking={booking}
                onChat={handleChat}
              />
            ))}
            {confirmedBookings.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No confirmed bookings
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed Calls</CardTitle>
          <CardDescription>List of completed calls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedBookings.map((booking) => (
              <BookingCallsCard key={booking.id} booking={booking} />
            ))}
            {completedBookings.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No completed bookings
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cancelled Calls</CardTitle>
          <CardDescription>List of cancelled calls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cancelledBookings.map((booking) => (
              <BookingCallsCard key={booking.id} booking={booking} />
            ))}
            {cancelledBookings.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No cancelled bookings
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
