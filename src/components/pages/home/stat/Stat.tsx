import React from "react";
import { VideoSection } from "./VideoSection";
import { StatsSection } from "./StatsSection";
import { StatTypes } from "./types";

const stats: StatTypes[] = [
  {
    icon: "users",
    value: "15000+",
    label: "Interested Users",
  },
  {
    icon: "check",
    value: "1200+",
    label: "Responded Users",
  },
  {
    icon: "heart",
    value: "25+",
    label: "Need The Service",
  },
];

const Stat = () => {
  return (
    <div>
      <VideoSection
        imageUrl="/placeholder.svg?height=720&width=1280"
        videoUrl="/meditation-video.mp4"
      />
      <StatsSection stats={stats} />
    </div>
  );
};

export default Stat;
