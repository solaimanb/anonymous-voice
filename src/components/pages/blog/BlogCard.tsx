import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  excerpt: string;
  image: string;
  slug: string;
}

export default function BlogCard({
  title,
  excerpt,
  image,
  slug,
}: BlogCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          className="object-cover transition-transform hover:scale-105"
          fill
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{excerpt}</p>
      </CardContent>
      <CardFooter className="px-4 pb-4">
        <Link
          href={`/blog/${slug}`}
          className="text-[#86C6C6] hover:text-[#78b7b7] text-sm font-medium"
        >
          Read More...
        </Link>
      </CardFooter>
    </Card>
  );
}
