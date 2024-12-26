import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface ChatContact {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp?: string;
  isActive?: boolean;
  hasHeart?: boolean;
}

interface UserProfileProps {
  selectedUser: ChatContact;
}

const UserProfile: React.FC<UserProfileProps> = ({ selectedUser }) => {
  return (
    <Card className="h-full rounded-none border-0">
      <div className="flex flex-col items-center p-6 text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="/images/avatar.svg" alt={selectedUser.username} />
          <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">{selectedUser.username}</h2>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span>10 min Call</span>
          <span>•</span>
          <span>3:00 pm</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-green-500">Active Now</span>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;
