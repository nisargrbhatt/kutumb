export interface Event {
  id?: string;
  name: string;
  location: string;
  description: string;
  user_response?: UserResponse[];
  date: Date | string;
  time: string;
  createdAt: string;
  createdBy: string;
}

export interface UserResponse {
  userId: string;
  name: string;
  count: number;
}
