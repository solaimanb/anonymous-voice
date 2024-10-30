"use client";

import Hero from "@/components/pages/home/hero/Hero";
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

export default function Page() {
  return (
    <div>
      <Hero />
      <WhoWeAre {...whoWeAreProps} />
    </div>
  );
}
