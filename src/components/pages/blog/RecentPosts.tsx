import { Button } from "@/components/ui/button";
import BlogCard from "./BlogCard";

const posts = [
  {
    title: "The Importance of Self-Care: Nurturing Your Mental Health",
    excerpt:
      "This article discusses the concept of self-care and its significance in maintaining mental health.It offers actionable self-care tips and practices that readers can incorporate into their daily lives.",
    image: "/placeholder.svg?height=400&width=600",
    slug: "importance-of-self-care-1",
  },
  {
    title: "The Importance of Self-Care: Nurturing Your Mental Health",
    excerpt:
      "This article discusses the concept of self-care and its significance in maintaining mental health.It offers actionable self-care tips and practices that readers can incorporate into their daily lives.",
    image: "/placeholder.svg?height=400&width=600",
    slug: "importance-of-self-care-2",
  },
  {
    title: "The Importance of Self-Care: Nurturing Your Mental Health",
    excerpt:
      "This article discusses the concept of self-care and its significance in maintaining mental health.It offers actionable self-care tips and practices that readers can incorporate into their daily lives.",
    image: "/placeholder.svg?height=400&width=600",
    slug: "importance-of-self-care-3",
  },
  {
    title: "The Importance of Self-Care: Nurturing Your Mental Health",
    excerpt:
      "This article discusses the concept of self-care and its significance in maintaining mental health.It offers actionable self-care tips and practices that readers can incorporate into their daily lives.",
    image: "/placeholder.svg?height=400&width=600",
    slug: "importance-of-self-care-4",
  },
  {
    title: "The Importance of Self-Care: Nurturing Your Mental Health",
    excerpt:
      "This article discusses the concept of self-care and its significance in maintaining mental health.It offers actionable self-care tips and practices that readers can incorporate into their daily lives.",
    image: "/placeholder.svg?height=400&width=600",
    slug: "importance-of-self-care-5",
  },
  {
    title: "The Importance of Self-Care: Nurturing Your Mental Health",
    excerpt:
      "This article discusses the concept of self-care and its significance in maintaining mental health.It offers actionable self-care tips and practices that readers can incorporate into their daily lives.",
    image: "/placeholder.svg?height=400&width=600",
    slug: "importance-of-self-care-6",
  },
];

export default function RecentPosts() {
  return (
    <section className="w-full px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium text-[#86C6C6] mb-12">
          Recent Posts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post, index) => (
            <BlogCard key={index} {...post} />
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="bg-[#86C6C6] text-white hover:bg-[#78b7b7] border-0"
          >
            View All Posts
          </Button>
        </div>
      </div>
    </section>
  );
}
