"use client";

import React from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { BookingCallsCard } from "@/components/cards/BookingCallsCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AppointmentService } from "@/services/appointment.service";

const mapApiStatusToBookingStatus = (
  status: string,
): "pending" | "confirmed" | "completed" | "cancelled" | "running" => {
  switch (status.toLowerCase()) {
    case "pending":
      return "pending";
    case "confirmed":
      return "confirmed";
    case "completed":
      return "completed";
    case "cancelled":
      return "cancelled";
    case "running":
      return "running";
    default:
      return "pending";
  }
};

export default function Messages() {
  const { appointments, isLoading, refetch } = useAppointments();

  const chatAppointments = appointments.filter(
    (appointment) => appointment.appointmentType === "Chat",
  );

  const appointmentsByStatus = {
    pending: chatAppointments.filter(
      (appointment) => appointment.status === "pending",
    ),
    confirmed: chatAppointments.filter(
      (appointment) => appointment.status === "confirmed",
    ),
  };

  const handleAccept = async (appointmentId: string) => {
    await AppointmentService.updateAppointment(appointmentId, {
      status: "confirmed",
    });
    refetch();
  };

  const handleReject = async (appointmentId: string) => {
    await AppointmentService.updateAppointment(appointmentId, {
      status: "cancelled",
    });
    refetch();
  };

  const handleChat = async (appointmentId: string) => {
    // Implement chat functionality
    console.log("Starting chat for:", appointmentId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Chat</CardTitle>
          <CardDescription>Chat messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Pending Chats</CardTitle>
          <CardDescription>Chat requests waiting for approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointmentsByStatus.pending.map((appointment) => (
              <BookingCallsCard
                key={appointment._id}
                booking={{
                  id: appointment._id,
                  status: mapApiStatusToBookingStatus(appointment.status),
                  user: {
                    id: appointment.menteeUserName,
                    username: appointment.menteeUserName,
                    name: appointment.menteeUserName,
                    email: "",
                    avatarUrl: null,
                  },
                  schedule: appointment.selectedSlot[0].time,
                  duration: "30",
                  createdAt: appointment.createdAt,
                  updatedAt: appointment.updatedAt,
                }}
                onAccept={() => handleAccept(appointment._id)}
                onReject={() => handleReject(appointment._id)}
                isPending={appointment.status === "pending"}
              />
            ))}
            {appointmentsByStatus.pending.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No pending chat requests
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Confirmed Chats
          </CardTitle>
          <CardDescription>Active chat sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointmentsByStatus.confirmed.map((appointment) => (
              <BookingCallsCard
                key={appointment._id}
                booking={{
                  id: appointment._id,
                  status: mapApiStatusToBookingStatus(appointment.status),
                  user: {
                    id: appointment.menteeUserName,
                    username: appointment.menteeUserName,
                    name: appointment.menteeUserName,
                    email: "",
                    avatarUrl: null,
                  },
                  schedule: appointment.selectedSlot[0].time,
                  duration: "30",
                  createdAt: appointment.createdAt,
                  updatedAt: appointment.updatedAt,
                }}
                onAccept={() => handleAccept(appointment._id)}
                onReject={() => handleReject(appointment._id)}
                onChat={() => handleChat(appointment._id)}
                isPending={false}
              />
            ))}
            {appointmentsByStatus.confirmed.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No confirmed chats
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
