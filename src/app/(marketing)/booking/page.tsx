"use client";

import BookingDetailsCard from "@/components/pages/booking/BookingDetailsCard";
import ChoosePlan from "@/components/pages/booking/ChoosePlan";
import Pricing from "@/components/pages/booking/Pricing";
import useVolunteers from "@/hooks/useVolunteers";
import { Volunteer } from "@/types/volunteer";

export default function Booking() {
  const { volunteers, loading, error } = useVolunteers<Volunteer[]>();

  if (loading) return <div>Booking...</div>;
  if (error) return <div>Error Booking: {error}</div>;

  return (
    <div>
      {volunteers.slice(0, 1).map((volunteer) => (
        <BookingDetailsCard
          key={volunteer.id}
          name={volunteer.name}
          title={volunteer.title}
          imageUrl={volunteer.imageUrl}
          yearsExperience={volunteer.yearsExperience}
          bookingsCompleted={volunteer.bookingsCompleted}
          expertise={volunteer.expertise}
          description={volunteer.description}
          date={volunteer.date}
          timeSlots={volunteer.timeSlots}
        />
      ))}
      <ChoosePlan />
      <Pricing />
    </div>
  );
}
