export interface Memory {
  id?: string;
  photos: string[];
  description: string;
  tags: string[];
  likes: string[];
  comments: MemoryComment[];
  createdAt: string;
  createdBy: string;
}

export interface MemoryComment {
  id?: string;
  userId: string;
  message: string;
  createdAt: string;
}
