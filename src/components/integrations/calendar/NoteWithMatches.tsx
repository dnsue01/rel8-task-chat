
import React from 'react';
import { MatchResult, CalendarEvent } from "../../../types/integrations";
import { Note } from "../../../types/index";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NoteWithMatchesProps {
  note: Note;
  matches: MatchResult[];
  calendarEvents: CalendarEvent[];
}

const NoteWithMatches: React.FC<NoteWithMatchesProps> = ({ note, matches, calendarEvents }) => {
  return (
    <Card className="border hover:shadow-sm transition-shadow">
      <CardContent className="p-3">
        <p className="text-sm line-clamp-2 mb-2">{note.content}</p>
        
        {matches.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Posibles relaciones:</p>
            <div className="flex flex-wrap gap-1">
              {matches.map((match, i) => {
                if (match.eventId) {
                  const event = calendarEvents.find(e => e.id === match.eventId);
                  return event ? (
                    <Badge key={i} variant="outline" className="text-xs">
                      📅 {event.title}
                    </Badge>
                  ) : null;
                }
                return null;
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteWithMatches;
