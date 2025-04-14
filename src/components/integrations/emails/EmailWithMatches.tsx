
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Email, CalendarEvent, MatchResult } from "@/types/integrations";
import { Note } from "@/types/index";
import { format } from "date-fns";
import { Link2 } from "lucide-react";

interface EmailWithMatchesProps {
  email: Email;
  matches: MatchResult[];
  notes: Note[];
  calendarEvents: CalendarEvent[];
  onLinkNote: (noteId: string) => void;
}

const EmailWithMatches: React.FC<EmailWithMatchesProps> = ({
  email,
  matches,
  notes,
  calendarEvents,
  onLinkNote,
}) => {
  const hasEventMatch = matches.some((m) => m.eventId);
  const hasNoteMatch = matches.some((m) => m.noteId);

  return (
    <div className="border rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{email.subject}</h4>
        <p className="text-xs text-gray-500">
          {format(email.receivedAt, "d MMM, HH:mm")}
        </p>
      </div>

      <p className="text-xs text-gray-500 mb-1">
        De: {email.sender}
      </p>

      <p className="text-xs line-clamp-2 text-gray-600 mb-2">{email.content}</p>

      {(hasEventMatch || hasNoteMatch) && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Posibles relaciones:</p>
          <div className="flex flex-wrap gap-1 mb-1">
            {matches
              .filter((m) => m.noteId)
              .slice(0, 2)
              .map((match, i) => {
                const note = notes.find((n) => n.id === match.noteId);
                return note ? (
                  <Badge
                    key={`note-${i}`}
                    variant="outline"
                    className="text-xs bg-blue-50"
                  >
                    📝 {note.content.substring(0, 20)}...
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLinkNote(note.id)}
                      className="h-5 w-5 p-0 ml-1"
                    >
                      <Link2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ) : null;
              })}

            {matches
              .filter((m) => m.eventId)
              .slice(0, 2)
              .map((match, i) => {
                const event = calendarEvents.find(
                  (e) => e.id === match.eventId
                );
                return event ? (
                  <Badge
                    key={`event-${i}`}
                    variant="outline"
                    className="text-xs bg-green-50"
                  >
                    📅 {event.title}
                  </Badge>
                ) : null;
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailWithMatches;
