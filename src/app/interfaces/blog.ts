export interface Blog {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  published: boolean;
  tags: string[];
  likes: string[];
  comments: BlogComment[];
  createdBy: string;
  author: BlogUser;
  createdAt: Date | string;
  publishedAt?: Date | string;
}

export interface BlogComment {
  id?: string;
  message: string;
  createdAt: Date | string;
  user: BlogUser;
}

export interface BlogUser {
  id?: string;
  userId: string;
  displayName: string;
  photoURL?: string;
  email?: string;
}
