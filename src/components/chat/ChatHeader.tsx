import { Phone } from "lucide-react";
import Image from "next/image";

export const ChatHeader = ({
  user,
  // callDuration,
  // callTime,
  // isActive,
  // onComplete,
  // onCancel,
}: {
  user: { name: string; avatar: string };
  callDuration?: string;
  callTime?: string;
  isActive?: boolean;
  onComplete?: () => void;
  onCancel?: () => void;
}) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
      <div className="flex items-center">
        <Image
          src={user.avatar}
          alt={user.name}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          <p className="text-xs text-gray-500">Active 5m ago</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Phone className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};
