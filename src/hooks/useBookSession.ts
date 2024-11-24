import { useState } from "react";
import { PlanOption } from "@/types/plan";

interface BookSessionParams {
  mentorUsername: string;
  plan: PlanOption;
}

export const useBookSession = () => {
  const [isLoading, setIsLoading] = useState(false);

  const bookSession = async ({ mentorUsername, plan }: BookSessionParams) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mentorUsername,
          duration: plan.duration,
          time: plan.time,
          date: plan.date,
          validity: plan.validity,
          type: plan.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Booking failed");
      }

      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };

  return { bookSession, isLoading };
};
