import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ChatUserProfile() {
  return (
    <Card className="h-full rounded-none border-0">
      <div className="flex flex-col items-center p-6 text-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src="/placeholder.svg" alt="Lois Griffin" />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold">Lois Griffin</h2>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <span>10 min Call</span>
          <span>•</span>
          <span>3:00 pm</span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-green-500">Active Now</span>
        </div>
        <div className="grid w-full gap-2 mt-6">
          <Button className="bg-green-500 hover:bg-green-600">Completed</Button>
          <Button variant="destructive">Cancel</Button>
        </div>
      </div>
    </Card>
  );
}
