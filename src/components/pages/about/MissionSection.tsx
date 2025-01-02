import Image from "next/image";

export default function MissionSection() {
  return (
    <section className="w-full px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-center text-[#9B8ACB] mb-12">
          Our Mission
        </h2>

        <div className="rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Text Content */}
            <div className="prose prose-lg opacity-80">
              <p>
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up
                one of the more obscure Latin words, consectetur, from a Lorem
                Ipsum passage, and going through the cites of the word in
                classical literature, discovered the undoubtable source.
              </p>
              <p>
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up
                one of the more obscure Latin words, consectetur, from a Lorem
                Ipsum passage, and going through the cites of the word in
                classical literature, discovered the undoubtable source.
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old. Richard McClintock, a
                Latin professor at Hampden-Sydney College in Virginia, looked up
                one of the more obscure Latin words,
              </p>
            </div>

            {/* Image */}
            <div className="relative w-full h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/our-mission.png"
                alt="Group of diverse people in a library showing support"
                className="object-cover"
                layout="fill"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
