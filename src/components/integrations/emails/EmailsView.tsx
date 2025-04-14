
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";
import { Email, CalendarEvent } from "@/types/integrations";
import { Note } from "@/types/index";
import EmailCard from "./EmailCard";
import EmailWithMatches from "./EmailWithMatches";

interface EmailsViewProps {
  emails: Email[];
  emailsForSelectedDate: Email[];
  notes: Note[];
  calendarEvents: CalendarEvent[];
  selectedDate: Date;
  syncingEmail: boolean;
  onSyncEmail: () => void;
  onLinkEmailToNote: (noteId: string, emailId: string) => void;
  findMatchesForEmail: (emailId: string) => any[];
}

const EmailsView: React.FC<EmailsViewProps> = ({
  emails,
  emailsForSelectedDate,
  notes,
  calendarEvents,
  selectedDate,
  syncingEmail,
  onSyncEmail,
  onLinkEmailToNote,
  findMatchesForEmail,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Correos del día</CardTitle>
          <CardDescription>
            {format(selectedDate, "EEEE d MMMM, yyyy", { locale: es })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailsForSelectedDate.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>No hay correos para este día</p>
              <Button
                variant="link"
                onClick={onSyncEmail}
                disabled={syncingEmail}
                className="mt-2"
              >
                <RefreshCw
                  className={`mr-2 h-3 w-3 ${syncingEmail ? "animate-spin" : ""}`}
                />
                Sincronizar correos
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[450px] pr-4">
              <div className="space-y-4">
                {emailsForSelectedDate.map((email) => (
                  <EmailCard
                    key={email.id}
                    email={email}
                    notes={notes}
                    onLinkNote={(noteId) => onLinkEmailToNote(noteId, email.id)}
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
            <CardTitle className="text-base">Correos por procesar</CardTitle>
            <CardDescription>Correos sin vinculación</CardDescription>
          </CardHeader>
          <CardContent>
            {emails.filter((e) => !e.linkedNoteId && !e.linkedEventId).length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay correos sin vincular
              </p>
            ) : (
              <ScrollArea className="h-[300px] pr-2">
                <div className="space-y-3">
                  {emails
                    .filter((e) => !e.linkedNoteId && !e.linkedEventId)
                    .slice(0, 3)
                    .map((email) => (
                      <EmailWithMatches
                        key={email.id}
                        email={email}
                        matches={findMatchesForEmail(email.id)}
                        notes={notes}
                        calendarEvents={calendarEvents}
                        onLinkNote={(noteId) => onLinkEmailToNote(noteId, email.id)}
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

export default EmailsView;
