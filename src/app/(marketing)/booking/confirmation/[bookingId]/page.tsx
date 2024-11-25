"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Video, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import api from "@/config/axios.config";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface BookingConfirmation {
  id: string;
  mentorUsername: string;
  sessionDetails: {
    duration: string;
    time: string;
    date: string;
    type: string;
  };
}

interface SessionDetailProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const SessionDetail = ({ icon, label, value }: SessionDetailProps) => (
  <div className="flex items-center gap-4 p-4 bg-soft-paste/10 rounded-lg">
    {icon}
    <div>
      <p className="text-xs text-soft-paste-dark">{label}</p>
      <p className="text-sm font-medium text-soft-paste-darker">{value}</p>
    </div>
  </div>
);

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  console.log("Booking ID: ", bookingId);

  useEffect(() => {
    if (!bookingId) {
      toast({
        title: "Invalid Booking",
        description: "No booking ID provided",
        duration: 3000,
      });
      router.push("/");
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        // const { data } = await api.get(`/api/v1/bookings/${params.bookingId}`);
        const { data } = await api.get(`/api/v1/bookings/${bookingId}`);
        if (!data) {
          throw new Error("Booking not found");
        }
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking details: ", error);
        toast({
          title: "Invalid Booking",
          description:
            "This booking does not exist or you don't have access to view it",
          duration: 3000,
        });
        router.push("/");
      }
    };
    fetchBookingDetails();
  }, [bookingId, router, toast]);

  if (!booking) return null;

  return (
    <div className="min-h-screen py-6 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="p-6 shadow border-soft-paste/20">
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="h-16 w-16 bg-soft-paste/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-soft-paste" />
              </div>
              <h1 className="text-xl font-bold text-violet-hover">
                Booking Confirmed!
              </h1>
              <p className="text-sm text-soft-paste-darker mt-2">
                Your session has been successfully scheduled
              </p>
            </div>

            <div className="space-y-4">
              <SessionDetail
                icon={<Calendar size={20} className="text-soft-paste" />}
                label="Date"
                value={booking.sessionDetails.date}
              />
              <SessionDetail
                icon={<Clock size={20} className="text-soft-paste" />}
                label="Time"
                value={booking.sessionDetails.time}
              />
              <SessionDetail
                icon={<Video size={20} className="text-soft-paste" />}
                label="Duration"
                value={booking.sessionDetails.duration}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full bg-soft-paste hover:bg-soft-paste-active text-white"
              onClick={() => (window.location.href = "/")}
            >
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// "use client";

// import { Calendar, Clock, Video, Check } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";

// const mockBooking = {
//   id: "book_123",
//   mentorUsername: "john.mentor",
//   sessionDetails: {
//     duration: "30 min",
//     time: "2:00 PM",
//     date: "Monday, Jan 22, 2024",
//     type: "video"
//   }
// };

// interface SessionDetailProps {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }

// const SessionDetail = ({ icon, label, value }: SessionDetailProps) => (
//   <div className="flex items-center gap-4 p-4 bg-soft-paste/10 rounded-lg">
//     {icon}
//     <div>
//       <p className="text-xs text-soft-paste-dark">{label}</p>
//       <p className="text-sm font-medium text-soft-paste-darker">{value}</p>
//     </div>
//   </div>
// );

// export default function BookingConfirmationPage() {
//   return (
//     <div className="min-h-screen py-6 bg-background">
//       <div className="max-w-2xl mx-auto px-4">
//         <Card className="p-6 shadow border-soft-paste/20">
//           <CardContent className="space-y-4">
//             <div className="text-center">
//               <div className="h-16 w-16 bg-soft-paste/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Check size={24} className=" text-soft-paste" />
//               </div>
//               <h1 className="text-xl font-bold text-violet-hover">
//                 Booking Confirmed!
//               </h1>
//               <p className="text-sm text-soft-paste-darker mt-2">
//                 Your session has been successfully scheduled
//               </p>
//             </div>

//             <div className="space-y-4">
//               <SessionDetail
//                 icon={<Calendar size={20} className="text-soft-paste" />}
//                 label="Date"
//                 value={mockBooking.sessionDetails.date}
//               />
//               <SessionDetail
//                 icon={<Clock size={20} className="text-soft-paste" />}
//                 label="Time"
//                 value={mockBooking.sessionDetails.time}
//               />
//               <SessionDetail
//                 icon={<Video size={20} className="text-soft-paste" />}
//                 label="Duration"
//                 value={mockBooking.sessionDetails.duration}
//               />
//             </div>
//           </CardContent>

//           <CardFooter className="flex flex-col gap-4">
//             <Button
//               className="w-full bg-soft-paste hover:bg-soft-paste-active text-white"
//               onClick={() => window.location.href = '/'}
//             >
//               Back to Home
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }
