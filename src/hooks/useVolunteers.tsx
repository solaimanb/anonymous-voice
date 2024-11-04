// hooks/useVolunteers.ts
import { useEffect, useState } from "react";

interface Expertise {
  name: string;
}

export interface Volunteer {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  rating: number;
  yearsExperience: number;
  sessionsCompleted: number;
  expertise: Expertise[];
  description: string;
}

const useVolunteers = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await fetch("/data/volunteers.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVolunteers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  return { volunteers, loading, error };
};

export default useVolunteers;
