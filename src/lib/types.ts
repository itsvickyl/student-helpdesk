export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  dob?: string;
  address?: string;
}

export type TicketStatus = 'Solved' | 'Unsolved';

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  response?: string;
}
