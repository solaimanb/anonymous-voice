"use client";

import { useState } from "react";
import { useMentorRequests } from "@/hooks/useMentorRequests";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MentorRequest } from "@/types/mentor.types";

const LoadingTableRow = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[120px]" />
    </TableCell>
    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </TableCell>
  </TableRow>
);

export default function MentorRequests() {
  const {
    mentorRequests,
    isLoading,
    error,
    approveMentor,
    rejectMentor,
    refetch,
  } = useMentorRequests();
  const [selectedMentor, setSelectedMentor] = useState<MentorRequest | null>(
    null,
  );
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleApproveClick = (mentor: MentorRequest) => {
    setSelectedMentor(mentor);
    setApproveDialogOpen(true);
  };

  const handleRejectClick = (mentor: MentorRequest) => {
    setSelectedMentor(mentor);
    setRejectDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (selectedMentor) {
      await approveMentor(selectedMentor.userName);
      refetch();
      setApproveDialogOpen(false);
      setSelectedMentor(null);
    }
  };

  const handleConfirmReject = async () => {
    if (selectedMentor) {
      await rejectMentor(selectedMentor.id);
      refetch();
      setRejectDialogOpen(false);
      setSelectedMentor(null);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold">
          {isLoading ? <Skeleton className="h-8 w-48" /> : "Mentor Requests"}
        </h1>
      </div>

      <div className="border rounded-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <LoadingTableRow key={index} />
              ))
            ) : !mentorRequests.length ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-gray-500 py-8"
                >
                  No mentor requests found
                </TableCell>
              </TableRow>
            ) : (
              mentorRequests.map((mentor) => (
                <TableRow key={mentor.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                      <AvatarFallback>{mentor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{mentor.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {mentor.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{mentor.designation}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
                        onClick={() => handleApproveClick(mentor)}
                        disabled={mentor.adminApproval}
                      >
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleRejectClick(mentor)}
                        disabled={mentor.adminApproval}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-md">
              Approve Mentor Request
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to approve {selectedMentor?.name} as a
              mentor? They will gain access to mentor features on the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={handleConfirmApprove}
              className="text-xs bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Mentor Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject {selectedMentor?.name}&apos;s
              mentor request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
