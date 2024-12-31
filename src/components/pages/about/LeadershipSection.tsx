import { Button } from "@/components/ui/button";
import Image from "next/image";
import { TeamMember } from "./types.about";

const members: TeamMember[] = [
  {
    name: "Sarah Thompson",
    role: "Volunteer",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "John Martinez",
    role: "Volunteer",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Emily Chen",
    role: "Volunteer",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Michael Patel",
    role: "Volunteer",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Sarah Thompson",
    role: "Volunteer",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "John Martinez",
    role: "Volunteer",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Emily Chen",
    role: "Volunteer",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    name: "Michael Patel",
    role: "Volunteer",
    image: "/placeholder.svg?height=400&width=400",
  },
];

export default function LeadershipSection() {
  return (
    <section className="w-full px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-[#9B8ACB] mb-12">
          Our Leadership
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {members.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="rounded-[24px] overflow-hidden mb-4 w-full aspect-square">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  layout="fill"
                />
              </div>
              <h3 className="font-medium text-gray-900 text-center">
                {member.name}
              </h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="bg-[#86C6C6] text-white hover:bg-[#78b7b7] border-0"
          >
            See More
          </Button>
        </div>
      </div>
    </section>
  );
}
