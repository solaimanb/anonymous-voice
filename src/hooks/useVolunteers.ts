"use client";

import { Volunteer } from "@/types/volunteer";
import { useEffect, useState } from "react";

const useVolunteers = <T extends Volunteer[]>() => {
  const [volunteers, setVolunteers] = useState<T>([] as unknown as T);
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
