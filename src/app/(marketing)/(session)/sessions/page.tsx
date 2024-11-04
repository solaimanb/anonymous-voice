"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import VolunteerCard from "@/components/cards/VolunteerCard";
import useVolunteers from "@/hooks/useVolunteers";

export default function Session() {
  const { volunteers, loading, error } = useVolunteers();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto bg-gray-50 px-4 py-8 md:px-6 lg:px-8">
      {/* Header Section */}
      <div className="relative mb-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#7FCCCC] rounded-lg" />
          <div className="absolute top-0 left-0 w-16 h-16">
            <div className="absolute inset-0 bg-[#98D9D9] rounded-full -translate-x-1/4 -translate-y-1/4" />
            <div className="absolute inset-0 bg-[#98D9D9] rounded-full translate-x-1/4 translate-y-1/4 scale-75" />
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 transform rotate-90">
            <div className="absolute inset-0 bg-[#98D9D9] rounded-full -translate-x-1/4 -translate-y-1/4" />
            <div className="absolute inset-0 bg-[#98D9D9] rounded-full translate-x-1/4 translate-y-1/4 scale-75" />
          </div>
        </div>
        <h1 className="relative text-center text-white text-2xl md:text-3xl font-semibold py-6">
          Make a Difference Today
        </h1>
      </div>

      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl text-gray-600 mb-6">
          Who would you like to take the session with?
        </h2>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {volunteers.map((volunteer, index) => (
            <motion.div
              key={volunteer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <VolunteerCard
                name={volunteer.name}
                title={volunteer.title}
                imageUrl={volunteer.imageUrl}
                isActive={volunteer.isActive}
                rating={volunteer.rating}
                yearsExperience={volunteer.yearsExperience}
                sessionsCompleted={volunteer.sessionsCompleted}
                expertise={volunteer.expertise}
                description={volunteer.description}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* See More Button */}
        <div className="flex justify-center">
          <Button
            variant="secondary"
            className="bg-[#7FCCCC] text-white hover:bg-[#6BBBBB] transition-colors"
          >
            See More
          </Button>
        </div>
      </div>
    </div>
  );
}
