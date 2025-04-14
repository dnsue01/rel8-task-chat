
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw } from "lucide-react";
import { CalendarEvent } from "@/types/integrations";
import { Note } from "@/types/index";
import EventCard from "./EventCard";
import NoteWithMatches from "./NoteWithMatches";

interface CalendarViewProps {
  eventsForSelectedDate: CalendarEvent[];
  notes: Note[];
  calendarEvents: CalendarEvent[];
  selectedDate: Date;
  syncingCalendar: boolean;
  onSyncCalendar: () => void;
  onLinkNoteToEvent: (noteId: string, eventId: string) => void;
  findMatchesForNote: (noteId: string) => any[];
}

const CalendarView: React.FC<CalendarViewProps> = ({
  eventsForSelectedDate,
  notes,
  calendarEvents,
  selectedDate,
  syncingCalendar,
  onSyncCalendar,
  onLinkNoteToEvent,
  findMatchesForNote,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Eventos del día</CardTitle>
          <CardDescription>
            {format(selectedDate, "EEEE d MMMM, yyyy", { locale: es })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eventsForSelectedDate.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>No hay eventos para este día</p>
              <Button
                variant="link"
                onClick={onSyncCalendar}
                disabled={syncingCalendar}
                className="mt-2"
              >
                <RefreshCw
                  className={`mr-2 h-3 w-3 ${
                    syncingCalendar ? "animate-spin" : ""
                  }`}
                />
                Sincronizar eventos
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[450px] pr-4">
              <div className="space-y-4">
                {eventsForSelectedDate.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    notes={notes}
                    onLinkNote={(noteId) => onLinkNoteToEvent(noteId, event.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Notas relacionadas</CardTitle>
            <CardDescription>
              Notas con posible relación a eventos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay notas disponibles
              </p>
            ) : (
              <ScrollArea className="h-[300px] pr-2">
                <div className="space-y-3">
                  {notes.slice(0, 5).map((note) => (
                    <NoteWithMatches
                      key={note.id}
                      note={note}
                      matches={findMatchesForNote(note.id)}
                      calendarEvents={calendarEvents}
                    />
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
