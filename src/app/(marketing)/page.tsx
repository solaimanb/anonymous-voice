"use client";

import Hero from "@/components/pages/home/hero/Hero";
import HonourableVolunteers from "@/components/pages/home/volunteers/HonourableVolunteers";
import WhatWeDo from "@/components/pages/home/what-we-do/WhatWeDo";
import WhoWeAre from "@/components/pages/home/who-we-are/WhoWeAre";

const whoWeAreProps = {
  mobileImage: "https://via.placeholder.com/600x400",
  desktopImage: "https://via.placeholder.com/800x600",
  altImg: "Who We Are",
  title: "Who We Are",
  subtitle: "Committed to Your Mental Wellness with Compassionate Care",
  description:
    "At Anonymous Voice, we believe that every voice deserves to be heard, especially when it comes to mental health. We are dedicated to creating a safe, supportive space where individuals can seek guidance, share their experiences, and find solace without judgment.",
  extendedDescription:
    "Our team of compassionate professionals is committed to providing personalized mental health services that prioritize your unique journey. We understand that reaching out for help can be daunting, which is why we focus on creating a comfortable and confidential environment.",
  buttonText: "Learn More",
  onLearnMore: () => {
    // Handle the Learn More action
  },
};

const whatWeDoProps = {
  title: "What We Do",
  subtitle: "How Our Volunteers Are Trained",
  description:
    "A short paragraph introducing the work done by volunteers, highlighting the training they receive and how that equips them to help users.",
  videoThumbnail: "https://via.placeholder.com/600x400",
  trainingSteps: [
    {
      title: "Initial Screening",
      description:
        "Background checks, interviews, and mental health evaluations.",
    },
    {
      title: "Comprehensive Training",
      description:
        "Courses on mental health, empathy training, and crisis handling.",
    },
    {
      title: "Ongoing Education",
      description:
        "Continuous learning through workshops and mental health experts.",
    },
  ],
};

export default function Page() {
  return (
    <div>
      <Hero />
      <WhoWeAre {...whoWeAreProps} />
      <WhatWeDo {...whatWeDoProps} />
      <HonourableVolunteers />
    </div>
  );
}
