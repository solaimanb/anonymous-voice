"use client";

import Loading from "@/app/loading";
import BookingDetailsCard from "@/components/pages/booking/BookingDetailsCard";
import ChoosePlan from "@/components/pages/booking/ChoosePlan";
import useVolunteers from "@/hooks/useVolunteers";
import { Volunteer } from "@/types/volunteer";
import { useSearchParams } from "next/navigation";

export default function Booking() {
  const { volunteers, loading } = useVolunteers<Volunteer[]>();
  const searchParams = useSearchParams();
  const mentorUserName = searchParams.get("mentor") || "";

  if (loading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto mt-4">
      {volunteers.slice(0, 1).map((volunteer) => (
        <BookingDetailsCard
          key={volunteer.id}
          name={volunteer.name}
          userName={volunteer.userName}
          title={volunteer.title}
          avatarUrl={volunteer.avatarUrl}
          yearsExperience={volunteer.yearsExperience}
          bookingsCompleted={volunteer.bookingsCompleted}
          expertise={volunteer.expertise}
          description={volunteer.description}
          date={volunteer.date}
          timeSlots={volunteer.timeSlots}
        />
      ))}
      <ChoosePlan mentorUsername={mentorUserName} />
    </div>
  );
}
