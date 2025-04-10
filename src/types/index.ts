
// Types for our Contact and Task models

export type ContactStatus = "client" | "lead" | "collaborator" | "personal";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar?: string;
  status: ContactStatus;
  lastActivity?: Date;
  tags?: string[];
}

export type TaskStatus = "waiting" | "in-progress" | "done" | "overdue";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  contactId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  attachments?: string[];
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Note {
  id: string;
  contactId: string;
  content: string;
  createdAt: Date;
}
