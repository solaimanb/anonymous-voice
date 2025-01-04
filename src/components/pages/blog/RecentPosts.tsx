import { getAllPosts } from "@/lib/blog";
import BlogCard from "./BlogCard";
import { BlogPost } from "@/types/blog.types";

export default function RecentPosts() {
  const posts: BlogPost[] = getAllPosts();

  return (
    <section className="w-full px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-soft-paste mb-12">
          Recent Posts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              image={post.image}
              slug={post.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
