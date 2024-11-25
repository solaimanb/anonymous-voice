import { useState } from "react";
import { PlanOption } from "@/types/plan";
import { AuthService } from "@/services/auth.service";
import { useToast } from "./use-toast";
import api from "@/config/axios.config";
import axios from "axios";

export const useBookSession = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const bookSession = async (mentorUsername: string, plan: PlanOption) => {
    setIsLoading(true);
    const currentUser = AuthService.getStoredUser();

    try {
      // TODO: Implement API call to book session
      const { data } = await api.post("/api/v1/bookings", {
        mentorUsername,
        menteeUsername: currentUser?.userName,
        sessionDetails: {
          duration: plan.duration,
          time: plan.time,
          date: plan.date,
          type: plan.type,
        },
      });

      toast({
        title: "Session Booked!",
        description: `Your ${plan.duration} session is scheduled for ${plan.date} at ${plan.time}`,
      });

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Booking Failed",
          description:
            error.response?.data?.message || "Unable to book session",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Booking Failed",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { bookSession, isLoading };
};
