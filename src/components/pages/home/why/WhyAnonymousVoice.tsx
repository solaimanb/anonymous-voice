import { Button } from "@/components/ui/button";
import Image from "next/image";
import { VideoSection } from "../stat/VideoSection";

export default function WhyAnonymousVoice() {
  return (
    <section className="w-full px-4 py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-medium text-[#9B8ACB]">
              Why Anonymous Voice
            </h2>
            <h1 className="text-4xl md:text-5xl font-medium text-[#86C6C6] leading-tight">
              Compassionate Care,
              <br />
              Trusted Mental Health Support
            </h1>
            <p className="text-lg leading-relaxed max-w-xl">
              At Anonymous Voice, we believe that every voice deserves to be
              heard, especially when it comes to mental health. We are dedicated
              to creating a safe, supportive space where individuals can seek
              guidance, share their experiences, and find solace without
              judgment. Our team of compassionate professionals is committed to
              providing personalized mental health services that prioritize your
              unique journey. We understand that reaching out for help can be
              daunting, which is why we focus on creating a comfortable and
              confidential environment.
            </p>
            <Button className="bg-[#86C6C6] hover:bg-[#78b7b7] text-white px-8 py-6 text-lg rounded-md">
              Learn More <span className="ml-2">👋</span>
            </Button>
          </div>

          {/* Right Column */}
          <div className="relative">
            <div className="absolute inset-0 -z-10">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[140%] aspect-square rounded-full bg-[#86C6C6]/10" />
              <div className="absolute right-[10%] top-[40%] -translate-y-1/2 w-[140%] aspect-square rounded-full bg-[#9B8ACB]/10" />
            </div>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="/images/why-av.png"
                alt="Mental health professionals in a supportive group session"
                className="w-full h-full object-cover"
                layout="fill"
              />
            </div>
          </div>
        </div>
      </div>
      <VideoSection
        imageUrl="/images/why-av-vid.png"
        videoUrl="/meditation-video.mp4"
      />
    </section>
  );
}
