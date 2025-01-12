"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Image from "next/image";

interface BlogPost {
  title: string;
  author: string;
  readTime: string;
  tags: string[];
  content: string;
  image?: File;
}

export default function PostBlog() {
  const [post, setPost] = useState<BlogPost>({
    title: "",
    author: "",
    readTime: "",
    tags: [],
    content: "",
  });
  const [currentTag, setCurrentTag] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPost({ ...post, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      setPost({ ...post, tags: [...post.tags, currentTag.trim()] });
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost({ ...post, tags: post.tags.filter((tag) => tag !== tagToRemove) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the post data to your API
    console.log("Submitting post:", post);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Blog Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                placeholder="Understanding Mental Health Conditions: A Comprehensive Guide"
                className="bg-background"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={post.author}
                  onChange={(e) => setPost({ ...post, author: e.target.value })}
                  placeholder="Dr. Sarah Johnson"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="readTime">Read Time (in minutes)</Label>
                <Input
                  id="readTime"
                  value={post.readTime}
                  onChange={(e) =>
                    setPost({ ...post, readTime: e.target.value })
                  }
                  placeholder="15"
                  type="number"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={addTag}
                placeholder="Press Enter to add tags"
                className="bg-background"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-2 py-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Featured Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-background"
              />
              {imagePreview && (
                <div className="relative w-full h-[200px] mt-2 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                placeholder="Write your blog post content here..."
                className="min-h-[400px] bg-background"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline">Preview</Button>
          <Button onClick={handleSubmit}>Publish</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
