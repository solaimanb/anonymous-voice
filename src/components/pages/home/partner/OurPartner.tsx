import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Partner, PartnersProps } from "./types.partner";

const partners: Partner[] = [
  {
    name: "Axis Bank",
    logo: "/images/axis-bank.png",
    alt: "Axis Bank logo",
  },
  {
    name: "HDFC Bank",
    logo: "/images/hdfc-bank.png",
    alt: "HDFC Bank logo",
  },
  {
    name: "ICICI Bank",
    logo: "/images/icici-bank.png",
    alt: "ICICI Bank logo",
  },
  {
    name: "SBI",
    logo: "/images/sbi-bank.png",
    alt: "SBI logo",
  },
  {
    name: "Kotak Bank",
    logo: "/images/kotak-bank.png",
    alt: "Kotak Bank logo",
  },
  {
    name: "Federal Bank",
    logo: "/images/federal-bank.png",
    alt: "Federal Bank logo",
  },
];

export default function OurPartner({ title }: PartnersProps) {
  return (
    <section className="w-full py-16 lg:py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-violet mb-12">
          {title}
        </h2>

        <Marquee pauseOnHover speed={30} className="py-4">
          <div className="flex justify-around items-center w-full">
            {partners.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 w-24 md:w-32 aspect-square relative group transition-transform duration-200 hover:scale-105 mx-10"
              >
                <div className="absolute inset-0 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-2xl aspect-square">
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
          </div>
        </Marquee>
      </div>
    </section>
  );
}
