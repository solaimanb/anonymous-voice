import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

export default function ContactSection() {
  return (
    <section className="w-full px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-medium text-center text-[#9B8ACB] mb-2">
          Contact Us
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Any questions or remarks? Just write us a message!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
