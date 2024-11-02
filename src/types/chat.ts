interface User {
  id: string;
  name: string;
  avatar?: string;
  status?: "online" | "offline";
  lastActive?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

interface ChatSession {
  id: string;
  users: User[];
  messages: Message[];
  duration?: string;
  status: "active" | "completed" | "cancelled";
}
