import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: {
    duration: string;
    date: string;
    time: string;
  };
  isLoading: boolean;
}

export const BookingConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  bookingDetails,
  isLoading,
}: BookingConfirmationProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogDescription>
          {`You are about to book a ${bookingDetails.duration} minute session for ${bookingDetails.date} at ${bookingDetails.time}`}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="bg-soft-paste hover:bg-soft-paste-active"
        >
          {isLoading ? "Confirming..." : "Confirm Booking"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
