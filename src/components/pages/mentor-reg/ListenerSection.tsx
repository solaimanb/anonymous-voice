import { Check } from "lucide-react";
import Image from "next/image";

export default function ListenerSection() {
  const requirements = [
    "Background in psychology, social work, or counseling preferred",
    "Ability to commit [X] months for the program",
    "Willingness to work with a team",
    "Flexibility to take on varied tasks",
    "Background check required",
  ];

  const benefits = [
    "Gain experience in active listening and empathy",
    "Make a difference in people's lives",
    "Comprehensive mental health and support training",
    "Volunteer from home on a schedule that works for you",
  ];

  return (
    <section className="w-full px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-violet mb-12">
          Listener
        </h1>
        <h2 className="text-2xl font-bold text-start text-soft-paste">
          Become a Listener
        </h2>

        <div className="space-y-12">
          {/* Text Content */}
          <div className="space-y-8">
            <p className="text-muted-foreground leading-relaxed text-sm">
              As part of our Placement Program, you&apos;ll have the opportunity
              to immerse yourself in the mental health sector. You will work
              closely with professionals, gaining hands-on experience and
              contributing to impactful, real-world projects that support
              individuals in need. This program is designed to help you grow
              both personally and professionally while making a meaningful
              difference in mental health care.
            </p>

            {/* Requirements Section */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Requirements
                </h3>
                <ul className="space-y-3 text-sm font-medium">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-soft-paste mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden mt-6">
                <Image
                  src="/images/requirements.png"
                  alt="Mobile app interface showing task management"
                  className="object-cover"
                  layout="fill"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Benefits
                </h3>
                <ul className="space-y-3 text-sm font-medium">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-soft-paste mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden mt-6">
                <Image
                  src="/images/benefits.png"
                  alt="Document management interface"
                  className="object-cover"
                  layout="fill"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
