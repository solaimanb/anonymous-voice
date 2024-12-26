// "use client";

// import * as React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Send, Undo2 } from "lucide-react";
// import Link from "next/link";
// import { useState, useEffect, useRef } from "react";
// import { io, Socket } from "socket.io-client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { cn } from "@/lib/utils";
// import { AuthService } from "@/services/auth.service";
// import { socketService } from "@/services/socket.service";
// import { Skeleton } from "@/components/ui/skeleton";
// import Loading from "@/app/loading";
// import { useAppointments } from "@/hooks/useAppointments";
// import { ChatHeader } from "./ChatHeader";

// interface ChatContact {
//   id: string;
//   username: string;
//   avatar: string;
//   lastMessage: string;
//   timestamp?: string;
//   isActive?: boolean;
//   hasHeart?: boolean;
// }

// interface Message {
//   id: string;
//   sentBy: string;
//   sentTo: string;
//   message: string;
//   isSeen: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ReceivedMessage {
//   from: string;
//   fromUsername: string;
//   to: string;
//   toUsername: string;
//   message: string;
// }

// export default function ChatInterface() {
//   const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
//   const [isProfileOpen, setIsProfileOpen] = React.useState(false);
//   const [isLoading, setIsLoading] = React.useState(true);
//   const { appointments } = useAppointments();
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [users, setUsers] = useState<ChatContact[]>([]);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [selectedUser, setSelectedUser] = useState<ChatContact | null>(null);
//   const [messageInput, setMessageInput] = useState("");
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const currentActiveUser = AuthService.getStoredUser();

//   if (!currentActiveUser || !currentActiveUser.userName) {
//     throw new Error("User is not authenticated or username is missing");
//   }

//   const [currentUser] = useState<{ username: string; role: string }>({
//     username: currentActiveUser.userName,
//     role: currentActiveUser.role,
//   });

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (socket && selectedUser && messageInput.trim()) {
//       socket.emit("private message", {
//         to: selectedUser.username,
//         message: messageInput,
//       });

//       // Add the message to the local state
//       setMessages((prevMessages: Message[]) => [
//         ...prevMessages,
//         {
//           id: `${Date.now()}`,
//           sentBy: currentUser.username,
//           sentTo: selectedUser.username,
//           message: messageInput,
//           isSeen: false,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString(),
//         },
//       ]);

//       // Save the message to the database
//       try {
//         await socketService.saveMessage({
//           sentBy: currentUser.username,
//           sentTo: selectedUser.username,
//           message: messageInput,
//           isSeen: false,
//         });
//       } catch (error) {
//         console.error("Error saving message:", error);
//       }

//       setMessageInput("");
//       scrollToBottom();
//     }
//   };

//   useEffect(() => {
//     if (currentUser) {
//       const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
//         auth: {
//           username: currentUser.username,
//         },
//       });

//       setSocket(newSocket);

//       // Listen for user list updates
//       newSocket.on("users", (userList: ChatContact[]) => {
//         setUsers(userList);
//         setIsLoading(false);
//       });

//       // Listen for private messages
//       newSocket.on("private message", (data: ReceivedMessage) => {
//         if (
//           selectedUser &&
//           (data.fromUsername === selectedUser.username ||
//             data.toUsername === selectedUser.username)
//         ) {
//           setMessages((prevMessages) => [
//             ...prevMessages,
//             {
//               id: `${Date.now()}`,
//               sentBy: data.fromUsername,
//               sentTo: data.toUsername,
//               message: data.message,
//               isSeen: false,
//               createdAt: new Date().toISOString(),
//               updatedAt: new Date().toISOString(),
//             },
//           ]);
//           scrollToBottom();
//         }
//       });

//       // Listen for private message errors
//       newSocket.on("private message error", (error: Error) => {
//         console.error("Private message error:", error);
//       });

//       // Cleanup on component unmount
//       return () => {
//         newSocket.disconnect();
//       };
//     }
//   }, [currentUser, selectedUser]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (selectedUser) {
//         setIsLoading(true);
//         try {
//           const response = await socketService.getMessagesByUsername(
//             selectedUser.username,
//           );
//           const filteredMessages = response.data.filter(
//             (message) =>
//               (message.sentBy === currentUser.username &&
//                 message.sentTo === selectedUser.username) ||
//               (message.sentBy === selectedUser.username &&
//                 message.sentTo === currentUser.username),
//           );
//           setMessages(filteredMessages.reverse());
//           scrollToBottom();
//         } catch (error) {
//           console.error("Error fetching messages:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchMessages();
//   }, [selectedUser, currentUser.username]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   if (!currentActiveUser?.userName) {
//     return <Loading />;
//   }

//   // Filter confirmed appointments and map to ChatContact format
//   const confirmedAppointments = appointments
//     .filter((appointment) => appointment.status === "confirmed")
//     .map((appointment) => ({
//       id: appointment._id,
//       username:
//         currentUser.role === "mentor"
//           ? appointment.menteeUserName
//           : appointment.mentorUserName,
//       avatar: "/images/avatar.png",
//       lastMessage: "",
//       // isActive: true,
//     }));

//   // Remove duplicate users and filter out undefined values
//   const uniqueConfirmedAppointments = Array.from(
//     new Set(confirmedAppointments.map((a) => a.username)),
//   )
//     .map((username) => {
//       return confirmedAppointments.find((a) => a.username === username);
//     })
//     .filter((contact): contact is ChatContact => contact !== undefined);

//   // Filter contacts based on user role
//   const filteredContacts =
//     currentUser.role === "mentee"
//       ? uniqueConfirmedAppointments.filter(
//           (contact) =>
//             contact.username ===
//             appointments.find(
//               (appointment) =>
//                 appointment.menteeUserName === currentUser.username,
//             )?.mentorUserName,
//         )
//       : uniqueConfirmedAppointments;

//   return (
//     <div className="flex h-screen bg-background">
//       {/* Sidebar for larger screens */}
//       <aside className="hidden md:flex w-full max-w-[20vw] flex-col border-r">
//         {isLoading ? (
//           <Skeleton className="w-full h-full" />
//         ) : (
//           <ChatSidebar
//             contacts={filteredContacts}
//             setSelectedUser={setSelectedUser}
//             selectedUser={selectedUser}
//           />
//         )}
//       </aside>

//       {/* Main chat area */}
//       <main className="flex-1 flex flex-col">
//         {selectedUser ? (
//           <>
//             {/* Chat header */}
//             <ChatHeader
//               selectedUser={selectedUser}
//               isSidebarOpen={isSidebarOpen}
//               setIsSidebarOpen={setIsSidebarOpen}
//               isProfileOpen={isProfileOpen}
//               setIsProfileOpen={setIsProfileOpen}
//             />

//             {/* Messages */}
//             <ScrollArea className="flex-1 p-4">
//               {isLoading ? (
//                 <Skeleton className="w-full h-full" />
//               ) : (
//                 <AnimatePresence initial={false}>
//                   {Array.isArray(messages) &&
//                     messages.map((message) => (
//                       <motion.div
//                         key={message.id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className={cn(
//                           "flex mb-4",
//                           message?.sentBy === currentActiveUser?.userName
//                             ? "justify-end"
//                             : "justify-start",
//                         )}
//                       >
//                         <div
//                           className={cn(
//                             "max-w-[80%] rounded-lg px-4 py-2",
//                             message?.sentBy === currentActiveUser?.userName
//                               ? "bg-primary text-primary-foreground"
//                               : "bg-muted",
//                           )}
//                         >
//                           <p className="text-sm">{message.message}</p>
//                           {/* <span className="text-xs opacity-50 mt-1 block">
//                           {new Date(message.timestamp).toLocaleTimeString([], {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                           })}
//                         </span> */}
//                         </div>
//                       </motion.div>
//                     ))}
//                   <div ref={messagesEndRef} />
//                 </AnimatePresence>
//               )}
//             </ScrollArea>

//             {/* Message input */}
//             <footer className="p-4 border-t">
//               <form onSubmit={handleSendMessage} className="flex gap-2">
//                 <Input
//                   placeholder="Aa"
//                   value={messageInput}
//                   onChange={(e) => setMessageInput(e.target.value)}
//                   className="flex-1"
//                   onKeyPress={(e) => e.key === "Enter" && handleSendMessage(e)}
//                 />
//                 <Button type="submit" size="icon">
//                   <Send className="h-5 w-5" />
//                   <span className="sr-only">Send message</span>
//                 </Button>
//               </form>
//             </footer>
//           </>
//         ) : (
//           <div className="flex items-center justify-center flex-1">
//             <h2 className="text-xl font-semibold text-muted-foreground">
//               Please select a user to start conversation
//             </h2>
//           </div>
//         )}
//       </main>

//       {/* User profile sidebar for larger screens */}
//       {selectedUser && currentUser.role === "mentor" && (
//         <aside className="hidden lg:block w-80 xl:w-96 border-l">
//           <UserProfile selectedUser={selectedUser} />
//         </aside>
//       )}
//     </div>
//   );
// }

// const ChatSidebar = React.memo(function ChatSidebar({
//   contacts,
//   setSelectedUser,
//   selectedUser,
// }: {
//   setSelectedUser: React.Dispatch<React.SetStateAction<ChatContact | null>>;
//   contacts: ChatContact[];
//   selectedUser: ChatContact | null;
// }) {
//   const currentActiveuser = AuthService.getStoredUser();
//   return (
//     <>
//       <div className="p-2.5 flex items-center gap-4">
//         <Link href="/">
//           <Button variant="ghost" size="icon" className="">
//             <Undo2 size={20} />
//           </Button>
//         </Link>

//         <h1 className="text-xl font-semibold text-muted-foreground">Chats</h1>
//       </div>

//       <ScrollArea className="flex-1 border-t mt-3">
//         {contacts.map((contact, index) => (
//           <div
//             key={index}
//             className={cn(
//               "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-muted/40",
//               contact.isActive && "bg-accent",
//               contact.username === currentActiveuser?.userName && "hidden",
//               selectedUser?.username === contact.username && "bg-blue-100",
//             )}
//             onClick={() => setSelectedUser(contact)}
//           >
//             <Avatar className="w-8 h-8 border rounded-full">
//               <AvatarImage src={contact.avatar} alt={contact.username} />
//               <AvatarFallback>{contact.username.charAt(0)}</AvatarFallback>
//             </Avatar>

//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <span className="font-medium truncate">{contact.username}</span>
//                 {/* {contact.hasHeart && (
//                   <Heart className="h-4 w-4 shrink-0 fill-red-500 text-red-500" />
//                 )}
//                 {contact.timestamp && (
//                   <span className="text-xs text-muted-foreground ml-auto shrink-0">
//                     {contact.timestamp}
//                   </span>
//                 )} */}
//               </div>
//               {/* {contact.lastMessage && (
//                 <p className="text-sm text-muted-foreground truncate">
//                   {contact.lastMessage}
//                 </p>
//               )} */}
//             </div>
//           </div>
//         ))}
//       </ScrollArea>
//     </>
//   );
// });

// function UserProfile({ selectedUser }: { selectedUser: ChatContact }) {
//   return (
//     <Card className="h-full rounded-none border-0">
//       <div className="flex flex-col items-center p-6 text-center">
//         <Avatar className="h-24 w-24 mb-4">
//           <AvatarImage src="/images/avatar.svg" alt={selectedUser.username} />
//           <AvatarFallback>{selectedUser.username.charAt(0)}</AvatarFallback>
//         </Avatar>
//         <h2 className="text-xl font-semibold">{selectedUser.username}</h2>
//         <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
//           <span>10 min Call</span>
//           <span>•</span>
//           <span>3:00 pm</span>
//         </div>
//         <div className="flex items-center gap-1 mt-1">
//           <span className="h-2 w-2 rounded-full bg-green-500" />
//           <span className="text-sm text-green-500">Active Now</span>
//         </div>
//       </div>
//     </Card>
//   );
// }

"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { AuthService } from "@/services/auth.service";
import { socketService } from "@/services/socket.service";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/app/loading";
import { useAppointments } from "@/hooks/useAppointments";
import ChatSidebar from "@/components/chat/ChatSidebar";
import CallConfirmationDialog from "@/components/chat/CallConfirmationDialog";
import ChatMessages from "@/components/chat/ChatMessages";
import UserProfile from "@/components/chat/ChatUserProfile";
import { useRouter } from "next/navigation";

interface ChatContact {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp?: string;
  isActive?: boolean;
  hasHeart?: boolean;
}

interface Message {
  id: string;
  sentBy: string;
  sentTo: string;
  message: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ReceivedMessage {
  from: string;
  fromUsername: string;
  to: string;
  toUsername: string;
  message: string;
}

export default function ChatInterface() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { appointments } = useAppointments();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<ChatContact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatContact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const currentActiveUser = AuthService.getStoredUser();
  if (!currentActiveUser || !currentActiveUser.userName) {
    throw new Error("User is not authenticated or username is missing");
  }

  const [currentUser] = useState<{ username: string; role: string }>({
    username: currentActiveUser.userName,
    role: currentActiveUser.role,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (socket && selectedUser && messageInput.trim()) {
      socket.emit("private message", {
        to: selectedUser.username,
        message: messageInput,
      });

      // Add the message to the local state
      setMessages((prevMessages: Message[]) => [
        ...prevMessages,
        {
          id: `${Date.now()}`,
          sentBy: currentUser.username,
          sentTo: selectedUser.username,
          message: messageInput,
          isSeen: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      // Save the message to the database
      try {
        await socketService.saveMessage({
          sentBy: currentUser.username,
          sentTo: selectedUser.username,
          message: messageInput,
          isSeen: false,
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }

      setMessageInput("");
      scrollToBottom();
    }
  };

  const handleConfirmCall = () => {
    if (socket && selectedUser) {
      const roomLink = `av-session-${Date.now()}`;
      socket.emit("send room link", {
        to: selectedUser.username,
        roomLink,
      });
      setIsPopupOpen(false);
      router.push(`/chat/voice-call?roomLink=${roomLink}`);
    }
  };

  const handlePhoneClick = () => {
    setIsPopupOpen(true);
  };

  useEffect(() => {
    if (currentUser) {
      const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        auth: {
          username: currentUser.username,
        },
      });

      setSocket(newSocket);

      // Listen for user list updates
      newSocket.on("users", (userList: ChatContact[]) => {
        setUsers(userList);
        setIsLoading(false);
      });

      // Listen for private messages
      newSocket.on("private message", (data: ReceivedMessage) => {
        if (
          selectedUser &&
          (data.fromUsername === selectedUser.username ||
            data.toUsername === selectedUser.username)
        ) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: `${Date.now()}`,
              sentBy: data.fromUsername,
              sentTo: data.toUsername,
              message: data.message,
              isSeen: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]);
          scrollToBottom();
        }
      });

      // Listen for private message errors
      newSocket.on("private message error", (error: Error) => {
        console.error("Private message error:", error);
      });

      // Cleanup on component unmount
      return () => {
        newSocket.disconnect();
      };
    }
  }, [currentUser, selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedUser) {
        setIsLoading(true);
        try {
          const response = await socketService.getMessagesByUsername(
            selectedUser.username,
          );
          const filteredMessages = response.data.filter(
            (message) =>
              (message.sentBy === currentUser.username &&
                message.sentTo === selectedUser.username) ||
              (message.sentBy === selectedUser.username &&
                message.sentTo === currentUser.username),
          );
          setMessages(filteredMessages.reverse());
          scrollToBottom();
        } catch (error) {
          console.error("Error fetching messages:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!currentActiveUser?.userName) {
    return <Loading />;
  }

  // Filter confirmed appointments and map to ChatContact format
  const confirmedAppointments = appointments
    .filter((appointment) => appointment.status === "confirmed")
    .map((appointment) => ({
      id: appointment._id,
      username:
        currentUser.role === "mentor"
          ? appointment.menteeUserName
          : appointment.mentorUserName,
      avatar: "/images/avatar.png",
      lastMessage: "",
      // isActive: true,
    }));

  // Remove duplicate users and filter out undefined values
  const uniqueConfirmedAppointments = Array.from(
    new Set(confirmedAppointments.map((a) => a.username)),
  )
    .map((username) => {
      return confirmedAppointments.find((a) => a.username === username);
    })
    .filter((contact): contact is ChatContact => contact !== undefined);

  // Filter contacts based on user role
  const filteredContacts =
    currentUser.role === "mentee"
      ? uniqueConfirmedAppointments.filter(
          (contact) =>
            contact.username ===
            appointments.find(
              (appointment) =>
                appointment.menteeUserName === currentUser.username,
            )?.mentorUserName,
        )
      : uniqueConfirmedAppointments;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex w-full max-w-[20vw] flex-col border-r">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <ChatSidebar
            contacts={filteredContacts}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        )}
      </aside>

      {/* Main chat area */}
      <ChatMessages
        selectedUser={selectedUser}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        isLoading={isLoading}
        messages={messages}
        currentActiveUser={currentActiveUser}
        handleSendMessage={handleSendMessage}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        messagesEndRef={messagesEndRef}
        currentUser={currentUser}
        onPhoneClick={handlePhoneClick}
      />

      {/* User profile sidebar for larger screens */}
      {selectedUser && currentUser.role === "mentor" && (
        <aside className="hidden lg:block w-80 xl:w-96 border-l">
          <UserProfile selectedUser={selectedUser} />
        </aside>
      )}

      <CallConfirmationDialog
        isOpen={isPopupOpen}
        onOpenChange={setIsPopupOpen}
        selectedUser={selectedUser}
        handleConfirmCall={handleConfirmCall}
      />
    </div>
  );
}
