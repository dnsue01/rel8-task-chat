
// Mantenemos los tipos existentes y agregamos el campo avatar_url a User
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface Note {
  id: string;
  content: string;
  contactId?: string;
  createdAt: Date;
}

// Agregamos los tipos faltantes que están siendo usados en la aplicación
export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: ContactStatus;
  tags: string[];
  avatar?: string;
  lastActivity?: Date;
  notes?: Note[];
}

export type ContactStatus = "lead" | "client" | "collaborator" | "personal";

export interface Task {
  id: string;
  title: string;
  description?: string;
  content?: string;  // Adding content for backward compatibility
  dueDate?: Date;
  status: TaskStatus;
  priority: TaskPriority;
  contactId?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export type TaskStatus = "pending" | "in-progress" | "completed" | "cancelled" | "waiting" | "done" | "overdue";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

