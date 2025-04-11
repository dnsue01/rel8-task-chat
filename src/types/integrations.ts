
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
}

export interface MatchResult {
  noteId?: string;
  eventId?: string;
  confidence: number; // 0-100
  matchedOn: 'title' | 'content' | 'time' | 'contacts' | 'manual';
}
