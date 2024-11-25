export interface MentorRequest {
  id: string;
  name: string;
  userName: string;
  designation: string;
  status: "pending" | "approved" | "rejected";
  avatarUrl: string;
  adminApproval: boolean;
  email: string;
  availability: string;
  specialization: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T[];
}
