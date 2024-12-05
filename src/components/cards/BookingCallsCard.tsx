import { memo } from "react";
import { StatusBadge } from "../../app/(private)/dashboard/booked-calls/_components/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/types/booking";
import { Check, X, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BookingCallsCardProps {
  booking: Booking;
  onAccept?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  onChat?: (id: string) => Promise<void>;
  isPending?: boolean;
}

export const BookingCallsCard = memo(function BookingCallsCard({
  booking,
  onAccept,
  onReject,
  onChat,
  isPending = false,
}: BookingCallsCardProps) {
  const handleAction = async (
    action: (id: string) => Promise<void>,
    id: string,
  ) => {
    try {
      await action(id);
    } catch (error) {
      console.error(`Failed to perform action:`, error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={booking.user.avatarUrl ?? ""}
            alt={booking.user.username}
          />
          <AvatarFallback>
            {booking.user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{booking.user.name}</span>
          <span className="text-sm text-muted-foreground">
            {booking.user.email}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        <div className="text-sm text-muted-foreground grid grid-cols-2 sm:flex gap-4">
          <div>
            <div className="font-medium text-foreground">Schedule</div>
            {booking.schedule}
          </div>
          <div>
            <div className="font-medium text-foreground">Duration</div>
            {booking.duration}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-green-500 hover:text-green-600"
                onClick={() => onAccept && handleAction(onAccept, booking.id)}
              >
                <Check className="h-4 w-4" />
                <span className="sr-only">Accept</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-red-500 hover:text-red-600"
                onClick={() => onReject && handleAction(onReject, booking.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Reject</span>
              </Button>
            </div>
          ) : (
            <>
              {onChat && (
                <Badge
                  variant="secondary"
                  className="border border-dashed rounded-full bg-soft-paste-light-hover h-6 text-xs font-semibold cursor-pointer flex items-center"
                  onClick={() => handleAction(onChat, booking.id)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </Badge>
              )}
              <StatusBadge status={booking.status} />
            </>
          )}
        </div>
      </div>
    </div>
  );
});
