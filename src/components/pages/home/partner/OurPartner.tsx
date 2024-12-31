import Image from "next/image";
import { Partner, PartnersProps } from "./types.partner";
import { Marquee } from "./Marquee";

const partners: Partner[] = [
  {
    name: "Axis Bank",
    logo: "/placeholder.svg?height=100&width=100",
    alt: "Axis Bank logo",
  },
  {
    name: "HDFC Bank",
    logo: "/placeholder.svg?height=100&width=100",
    alt: "HDFC Bank logo",
  },
  {
    name: "ICICI Bank",
    logo: "/placeholder.svg?height=100&width=100",
    alt: "ICICI Bank logo",
  },
  {
    name: "SBI",
    logo: "/placeholder.svg?height=100&width=100",
    alt: "SBI logo",
  },
  {
    name: "Dominion Bank",
    logo: "/placeholder.svg?height=100&width=100",
    alt: "Dominion Bank logo",
  },
  {
    name: "Federal Bank",
    logo: "/placeholder.svg?height=100&width=100",
    alt: "Federal Bank logo",
  },
];

export default function OurPartner({ title }: PartnersProps) {
  // Double the partners array for seamless loop
  const doubledPartners = [...partners, ...partners];

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-[#9B8ACB] mb-12">
          {title}
        </h2>

        <Marquee pauseOnHover speed="slow" className="py-4">
          {doubledPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 w-24 md:w-32 aspect-square relative group transition-transform duration-200 hover:scale-105"
            >
              <div className="absolute inset-0 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-slate-200 rounded-2xl shadow p-4 aspect-square">
                <Image
                  src={partner.logo}
                  alt={partner.alt}
                  className="w-full h-full object-contain text-xs"
                  loading="lazy"
                  layout="fill"
                />
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
