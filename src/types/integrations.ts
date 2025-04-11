
import { Note } from "./index";

export interface GoogleAuthConfig {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  scope: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  linkedNoteId?: string;
  attendees?: string[];
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  due?: Date;
  completed?: boolean;
  status: "needsAction" | "completed";
  linkedNoteId?: string;
  listId?: string;
}

export interface TaskList {
  id: string;
  title: string;
}

export interface Email {
  id: string;
  subject: string;
  sender: string;
  recipients: string[];
  content: string;
  receivedAt: Date;
  linkedNoteId?: string;
  linkedEventId?: string;
}

export interface IntegrationSyncState {
  lastCalendarSync?: Date;
  lastEmailSync?: Date;
  lastTasksSync?: Date;
}

export interface MatchResult {
  noteId?: string;
  eventId?: string;
  taskId?: string;
  confidence: number; // 0-100
  matchedOn: 'title' | 'content' | 'time' | 'contacts' | 'manual';
}
