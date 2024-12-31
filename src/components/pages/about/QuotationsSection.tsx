import { Button } from "@/components/ui/button";
import QuoteCard from "./QuoteCard";

const quotes = [
  "&quot;By supporting global mental health, we are not just transforming individuals, we are uplifting entire communities and shaping a healthier world.&quot;",
  "&quot;Together, we can achieve a world where mental well-being is a fundamental right, not a privilege.&quot;",
  "&quot;Mental health is not a luxury, it is a necessity. Our vision is to make it accessible to all, leaving no one behind.&quot;",
];

export default function QuotationsSection() {
  return (
    <section className="w-full px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-[#9B8ACB] mb-6">
          Our Quotations
        </h2>

        <p className="text-2xl md:text-3xl text-center text-[#86C6C6] font-medium mb-12">
          &quot;Every story deserves a listener.&quot;
        </p>

        <div className="space-y-4">
          {quotes.map((quote, index) => (
            <QuoteCard key={index}>{quote}</QuoteCard>
          ))}
        </div>

        <div className="flex justify-center mt-8">
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
