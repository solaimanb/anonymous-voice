// import * as React from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Heart } from "lucide-react";

// interface ChatContact {
//   id: string;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   timestamp?: string;
//   isActive?: boolean;
//   hasHeart?: boolean;
// }

// export function ChatSidebar({ contacts }: { contacts: ChatContact[] }) {
//   return (
//     <div className="p-4 border-b">
//       <h1 className="text-xl font-semibold text-muted-foreground">Chats</h1>
//       <ScrollArea className="flex-1">
//         {contacts.map((contact) => (
//           <div
//             key={contact.id}
//             className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
//               contact.isActive && "bg-accent"
//             }`}
//           >
//             <Avatar className="h-12 w-12">
//               <AvatarImage src={contact.avatar} alt={contact.name} />
//               <AvatarFallback>{contact.name[0]}</AvatarFallback>
//             </Avatar>
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <span className="font-medium truncate">{contact.name}</span>
//                 {contact.hasHeart && (
//                   <Heart className="h-4 w-4 shrink-0 fill-red-500 text-red-500" />
//                 )}
//                 {contact.timestamp && (
//                   <span className="text-xs text-muted-foreground ml-auto shrink-0">
//                     {contact.timestamp}
//                   </span>
//                 )}
//               </div>
//               {contact.lastMessage && (
//                 <p className="text-sm text-muted-foreground truncate">
//                   {contact.lastMessage}
//                 </p>
//               )}
//             </div>
//           </div>
//         ))}
//       </ScrollArea>
//     </div>
//   );
// }
