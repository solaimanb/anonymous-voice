import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function ChatInput({
  newMessage,
  setNewMessage,
  handleSendMessage,
}: {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => void;
}) {
  return (
    <footer className="p-4 border-t">
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          placeholder="Aa"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </footer>
  );
}
