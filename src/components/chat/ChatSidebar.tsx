"use client";

import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/store/useChatStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppointmentsStore } from "@/store/useAppointmentsStore";
import { ChatService } from "@/services/chat.service";
import { ChatUser } from "@/types/chat.types";
import { useAuth } from "@/hooks/useAuth";

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  _id: string;
}

interface Appointment {
  _id: string;
  appointmentType: "Chat" | "Quick Call";
  status: "confirmed";
  selectedSlot: TimeSlot[];
  mentorUserName: string;
  menteeUserName: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatSidebarProps {
  setSelectedUser: (user: ChatUser) => void;
}

export function ChatSidebar({ setSelectedUser }: ChatSidebarProps) {
  const { user } = useAuth();
  const { appointments, loading, fetchAppointments } = useAppointmentsStore();
  const { setActiveRoom, activeRoomId } = useChatStore();

  const uniqueChatAppointments = Array.isArray(appointments)
    ? appointments.filter((appointment) => {
        if (!user) return false;

        const isValidAppointment =
          appointment.status === "confirmed" &&
          (appointment.appointmentType === "Chat" ||
            appointment.appointmentType === "Quick Call");

        if (user.role === "mentor") {
          return (
            isValidAppointment && appointment.mentorUserName === user.userName
          );
        } else {
          return (
            isValidAppointment && appointment.menteeUserName === user.userName
          );
        }
      })
    : [];

  useEffect(() => {
    fetchAppointments({
      status: "confirmed",
      types: ["Chat", "Quick Call"],
    });
  }, [fetchAppointments]);

  const handleUserSelect = async (appointment: Appointment): Promise<void> => {
    const displayName =
      user?.role === "mentor"
        ? appointment.menteeUserName
        : appointment.mentorUserName;

    const selectedUser: ChatUser = {
      id: user?.userName || "",
      key: appointment._id,
      username: displayName,
      status: "online",
      lastActive: appointment.updatedAt,
      appointmentTime: appointment.selectedSlot[0].time,
      appointmentDuration: "30",
    };

    setSelectedUser(selectedUser);
    const room = await ChatService.initializeSession(appointment._id);
    console.log("Room:", room);
    const roomId = `${appointment.mentorUserName}-${appointment.menteeUserName}`;
    setActiveRoom(roomId);
    console.log("Selected User ID:", appointment._id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2.5 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <Undo2 size={20} />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-muted-foreground">Chats</h1>
      </div>

      <ScrollArea className="flex-1 border-t mt-3">
        {loading ? (
          <div className="p-4 text-muted-foreground">
            Loading appointments...
          </div>
        ) : uniqueChatAppointments.length === 0 ? (
          <div className="p-4 text-muted-foreground">
            No chat appointments found
          </div>
        ) : (
          uniqueChatAppointments.map((appointment) => {
            const displayName =
              user?.role === "mentor"
                ? appointment.menteeUserName
                : appointment.mentorUserName;

            const roomId = `${appointment.mentorUserName}-${appointment.menteeUserName}`;
            const isActive = roomId === activeRoomId;

            return (
              <div
                key={appointment._id}
                className={cn(
                  "flex items-center gap-3 py-3 px-4 cursor-pointer transition-colors",
                  isActive
                    ? "bg-muted-foreground/10 text-accent-foreground"
                    : "hover:bg-muted/50",
                )}
                onClick={() => handleUserSelect(appointment)}
              >
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {displayName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-medium truncate",
                        isActive && "font-semibold",
                      )}
                    >
                      {displayName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-sm truncate",
                        isActive
                          ? "text-accent-foreground/80"
                          : "text-muted-foreground",
                      )}
                    >
                      {appointment.appointmentType}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </ScrollArea>
    </div>
  );
}
