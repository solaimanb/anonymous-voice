import BookingDetailsCard from "@/components/pages/booking/BookingDetailsCard";
import ChoosePlan from "@/components/pages/booking/ChoosePlan";
import Pricing from "@/components/pages/booking/Pricing";

export default function Booking() {
  return (
    <div>
      <BookingDetailsCard />
      <ChoosePlan />
      <Pricing />
    </div>
  );
}
