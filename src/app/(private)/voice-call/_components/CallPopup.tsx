import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";

interface CallPopupProps {
  callerName: string;
  callerAvatar: string;
  isCaller: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const CallPopup: React.FC<CallPopupProps> = ({
  callerName,
  callerAvatar,
  isCaller,
  onAccept,
  onDecline,
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="flex flex-col items-center">
        <Avatar className="h-20 w-20 mb-4">
          <AvatarImage src={callerAvatar} alt={callerName} />
          <AvatarFallback>{callerName.charAt(0)}</AvatarFallback>
        </Avatar>
        <p className="text-lg font-semibold">{callerName}</p>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        {!isCaller && (
          <Button
            onClick={onAccept}
            className="bg-green-500 hover:bg-green-600"
          >
            <Phone className="mr-2 h-4 w-4" />
            Accept
          </Button>
        )}
        <Button onClick={onDecline} variant="destructive">
          <PhoneOff className="mr-2 h-4 w-4" />
          {isCaller ? "Cancel" : "Decline"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CallPopup;
