export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in_progress' | 'completed' | 'reviewed';

export type JobLevel = 0 | 1 | 2 | 3 | 4 | 5;

export const DEPARTMENTS = [
  'Digital Infrastructure',
  'Legal & IP',
  'Digital Engagement & Design',
  'Global Alliance & Advocacy',
  'R&D',
  'Business Research & Analysis',
  'Executives'
] as const;

export type DepartmentName = typeof DEPARTMENTS[number];

export const ROLES = [
  { label: 'Administrator', level: 0 as JobLevel },
  { label: 'CEO', level: 1 as JobLevel },
  { label: 'CSO', level: 1 as JobLevel },
  { label: 'COO', level: 1 as JobLevel },
  { label: 'COO Associate', level: 2 as JobLevel },
  { label: 'Department Head', level: 3 as JobLevel },
  { label: 'Senior Associate (I & II)', level: 4 as JobLevel },
  { label: 'Junior Associate', level: 5 as JobLevel },
] as const;

export type RoleName = typeof ROLES[number]['label'];

export interface Department {
  id: string;
  name: DepartmentName;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: RoleName;
  roleLevel: JobLevel;
  departmentId?: string;
  avatarUrl?: string;
  password?: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedTo: string;
  status: Status;
  priority: Priority;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  taskId?: string;
  contactId?: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'assignment' | 'deadline' | 'mention' | 'task' | 'comment';
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'lead' | 'customer' | 'prospect' | 'employee';
  lastContacted: string;
  avatarUrl?: string;
  role?: RoleName;
  roleLevel?: JobLevel;
  departmentId?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  value: number;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed';
  probability: number;
}

export interface DashboardStats {
  totalRevenue: number;
  activeLeads: number;
  completedTasks: number;
  conversionRate: number;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  createdAt: string;
}
