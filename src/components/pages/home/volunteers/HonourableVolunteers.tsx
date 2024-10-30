"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type Volunteer = {
  id: number;
  name: string;
  title: string;
  image: string;
};

const volunteers: Volunteer[] = [
  {
    id: 1,
    name: "Sarah Thompson",
    title: "Volunteer",
    image: "https://via.placeholder.com/600x400",
  },
  {
    id: 2,
    name: "John Martinez",
    title: "Volunteer",
    image: "https://via.placeholder.com/600x400",
  },
  {
    id: 3,
    name: "Emily Chen",
    title: "Volunteer",
    image: "https://via.placeholder.com/600x400",
  },
  {
    id: 4,
    name: "Michael Patel",
    title: "Volunteer",
    image: "https://via.placeholder.com/600x400",
  },
];

export default function HonourableVolunteers() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 md:py-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-4xl font-bold text-center lg:text-start text-soft-paste mb-12"
      >
        Honourable Volunteers
      </motion.h2>

      <div className="relative w-[95vw]">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{
            clickable: true,
            bulletActiveClass: "bg-[#5EBFAE] opacity-100",
            bulletClass:
              "inline-block w-2 h-2 rounded-full bg-gray-300 mx-1 cursor-pointer transition-all duration-300",
          }}
          // navigation={{
          //   prevEl: '.swiper-button-prev',
          //   nextEl: '.swiper-button-next',
          // }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
          }}
          className="px-4 pb-12"
        >
          {volunteers.map((volunteer) => (
            <SwiperSlide key={volunteer.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-full h-48 max-w-[200px] md:max-w-[250px] lg:max-w-[300px] rounded-3xl overflow-hidden bg-[#E8E9FF] p-2">
                  <Image
                    src={volunteer.image}
                    alt={volunteer.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw, (min-width: 1024px) 33vw"
                    priority={volunteer.id <= 4}
                  />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {volunteer.name}
                </h3>
                <p className="text-sm text-gray-500">{volunteer.title}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {/* <button className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg text-gray-600 hover:text-gray-900 transition-colors">
          <ChevronLeft className="w-6 h-6" />
          <span className="sr-only">Previous</span>
        </button>
        <button className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg text-gray-600 hover:text-gray-900 transition-colors">
          <ChevronRight className="w-6 h-6" />
          <span className="sr-only">Next</span>
        </button> */}
      </div>

      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          className="bg-[#5EBFAE] text-white hover:bg-[#4EA99A] border-none"
        >
          See More
        </Button>
      </div>
    </section>
  );
}
