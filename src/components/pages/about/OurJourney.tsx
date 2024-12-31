import Image from "next/image";

export default function OurJourney() {
  return (
    <section className="w-full px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-[#9B8ACB] mb-12">
          Our Journey
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <div className="rounded-xl border h-full overflow-hidden shadow-lg">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="Supportive mental health consultation"
              className="w-full h-full object-cover"
              layout="fill"
            />
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-medium text-[#86C6C6] leading-tight">
              Committed to Your Mental Wellness with Compassionate Care
            </h3>

            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                At Anonymous Voice, we believe that every voice deserves to be
                heard, especially when it comes to mental health. We are
                dedicated to creating a safe, supportive space where individuals
                can seek guidance, share their experiences, and find solace
                without judgment. Our team of compassionate professionals is
                committed to providing personalized mental health services that
                prioritize your unique journey. We understand that reaching out
                for help can be daunting, which is why we focus on creating a
                comfortable and confidential environment.
              </p>

              <p className="leading-relaxed">
                At Anonymous Voice, we believe that every voice deserves to be
                heard, especially when it comes to mental health. We are
                dedicated to creating a safe, supportive space where individuals
                can seek guidance, share their experiences, and find solace
                without judgment. Our team of compassionate professionals is
                committed to providing personalized mental health services that
                prioritize your unique journey. We understand that reaching out
                for help can be daunting, which is why we focus on creating a
                comfortable and confidential environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
