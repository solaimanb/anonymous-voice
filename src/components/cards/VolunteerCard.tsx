"use client";

import {
  Star,
  Phone,
  MessageCircle,
  CalendarCheck,
  Clock,
  Users,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";

interface Expertise {
  name: string;
}

interface VolunteerProps {
  name: string;
  title: string;
  imageUrl: string;
  isActive?: boolean;
  rating: number;
  yearsExperience: number;
  sessionsCompleted: number;
  expertise: Expertise[];
  description: string;
  onQuickCall?: () => void;
  onChat?: () => void;
  onBookCall?: () => void;
}

export default function Component({
  name,
  title,
  imageUrl,
  isActive,
  rating,
  yearsExperience,
  sessionsCompleted,
  expertise,
  description,
  onQuickCall,
  onChat,
  onBookCall,
}: VolunteerProps) {
  return (
    <Card className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Profile Section */}
          <div className="shrink-0">
            <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted-foreground/20">
              <Image
                src={imageUrl}
                alt={name}
                width={200}
                height={200}
                className="w-full h-full object-cover text-xs"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-lg font-semibold">{name}</h2>
                <p className="text-gray-600">{title}</p>
              </div>
              {isActive && (
                <Badge className="bg-emerald-400 hover:bg-emerald-400 text-white border-0 rounded-md px-3">
                  Active Now
                </Badge>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < rating ? "text-[#7FCCCC] fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7FCCCC]" />
                <span className="text-sm text-gray-600">
                  {yearsExperience}+ years experience
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7FCCCC]" />
                <span className="text-sm text-gray-600">
                  Session Completed ({sessionsCompleted}+)
                </span>
              </div>
            </div>

            {/* Expertise */}
            <div className="flex flex-wrap gap-2 mb-4">
              {expertise.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7FCCCC]/10 text-sm text-[#7FCCCC]"
                >
                  <Award className="w-3.5 h-3.5" />
                  {item.name}
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="grid grid-cols-3 gap-3 p-3">
        <Button
          className="bg-[#7FCCCC] hover:bg-[#6BBBBB] text-white border-0 rounded-md h-11"
          onClick={onQuickCall}
        >
          <Phone className="w-4 h-4 mr-2" />
          Quick Call
        </Button>
        <Button
          className="bg-[#B4A5E8] hover:bg-[#A394D7] text-white border-0 rounded-md h-11"
          onClick={onChat}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
        <Button
          className="bg-[#7FCCCC] hover:bg-[#6BBBBB] text-white border-0 rounded-md h-11"
          onClick={onBookCall}
        >
          <CalendarCheck className="w-4 h-4 mr-2" />
          Book Call
        </Button>
      </CardFooter>
    </Card>
  );
}
