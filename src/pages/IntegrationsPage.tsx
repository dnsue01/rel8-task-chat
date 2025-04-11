
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { useIntegrations } from "../context/IntegrationsContext";
import { useCrm } from "../context/CrmContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, RefreshCw, Link2, AlertTriangle } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarEvent, Email, MatchResult } from "../types/integrations";
import { Note } from "../types/index";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

const IntegrationsPage: React.FC = () => {
  const { 
    isGoogleConnected, 
    connectGoogleCalendar, 
    disconnectGoogleCalendar,
    calendarEvents,
    emails, 
    syncState,
    syncCalendarEvents,
    syncEmails,
    getEventsForDate,
    getEmailsForDate,
    linkNoteToEvent,
    linkEmailToNote,
    findMatchesForNote,
    findMatchesForEmail
  } = useIntegrations();
  
  const { notes, getContactById } = useCrm();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState<string>("calendar");
  const [syncingCalendar, setSyncingCalendar] = useState<boolean>(false);
  const [syncingEmail, setSyncingEmail] = useState<boolean>(false);

  const handleSyncCalendar = async () => {
    setSyncingCalendar(true);
    await syncCalendarEvents();
    setSyncingCalendar(false);
  };

  const handleSyncEmail = async () => {
    setSyncingEmail(true);
    await syncEmails();
    setSyncingEmail(false);
  };
  
  const eventsForSelectedDate = getEventsForDate(selectedDate);
  const emailsForSelectedDate = getEmailsForDate(selectedDate);
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Integraciones</h1>
        
        {/* Connection Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Estado de Conexión</CardTitle>
            <CardDescription>
              Conecta tus cuentas de Google para sincronizar calendario y correos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Google Calendar</h3>
                  <p className="text-sm text-gray-500">
                    {isGoogleConnected ? 'Conectado' : 'No conectado'}
                  </p>
                </div>
              </div>
              <Button 
                variant={isGoogleConnected ? "outline" : "default"}
                onClick={isGoogleConnected ? disconnectGoogleCalendar : connectGoogleCalendar}
              >
                {isGoogleConnected ? 'Desconectar' : 'Conectar'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Mail className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium">Google Mail</h3>
                  <p className="text-sm text-gray-500">
                    {isGoogleConnected ? 'Conectado' : 'No conectado'}
                  </p>
                </div>
              </div>
              <Button 
                variant={isGoogleConnected ? "outline" : "default"}
                onClick={isGoogleConnected ? disconnectGoogleCalendar : connectGoogleCalendar}
              >
                {isGoogleConnected ? 'Desconectar' : 'Conectar'}
              </Button>
            </div>
          </CardContent>
          {isGoogleConnected && (
            <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <div className="text-sm text-gray-500">
                <span className="block sm:inline mr-4">
                  Última sincronización de calendario: {
                    syncState.lastCalendarSync 
                      ? formatDistanceToNow(syncState.lastCalendarSync, { addSuffix: true, locale: es })
                      : 'Nunca'
                  }
                </span>
                <span className="block sm:inline">
                  Última sincronización de correos: {
                    syncState.lastEmailSync 
                      ? formatDistanceToNow(syncState.lastEmailSync, { addSuffix: true, locale: es })
                      : 'Nunca'
                  }
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="flex-1 sm:flex-none" 
                  onClick={handleSyncCalendar}
                  disabled={!isGoogleConnected || syncingCalendar}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${syncingCalendar ? 'animate-spin' : ''}`} /> 
                  Sincronizar Calendario
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 sm:flex-none" 
                  onClick={handleSyncEmail}
                  disabled={!isGoogleConnected || syncingEmail}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${syncingEmail ? 'animate-spin' : ''}`} /> 
                  Sincronizar Correos
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
        
        {!isGoogleConnected && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg flex items-center gap-4 mb-8">
            <AlertTriangle className="text-amber-500 h-10 w-10 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-1">Conecta tu cuenta de Google</h3>
              <p className="text-gray-600">
                Para utilizar la sincronización de calendario y correos, primero debes conectar tu cuenta de Google.
              </p>
              <Button className="mt-4" onClick={connectGoogleCalendar}>
                Conectar con Google
              </Button>
            </div>
          </div>
        )}
        
        {isGoogleConnected && (
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Calendario
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Correo
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Eventos del día</CardTitle>
                    <CardDescription>
                      {format(selectedDate, 'EEEE d MMMM, yyyy', { locale: es })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {eventsForSelectedDate.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="mx-auto h-12 w-12 opacity-20 mb-2" />
                        <p>No hay eventos para este día</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {eventsForSelectedDate.map(event => (
                          <EventCard 
                            key={event.id} 
                            event={event} 
                            notes={notes}
                            onLinkNote={(noteId) => linkNoteToEvent(noteId, event.id)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notas relacionadas</CardTitle>
                      <CardDescription>
                        Notas con posible relación a eventos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {notes.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay notas disponibles</p>
                      ) : (
                        <div className="space-y-4">
                          {notes.slice(0, 5).map(note => (
                            <NoteWithMatches 
                              key={note.id} 
                              note={note} 
                              matches={findMatchesForNote(note.id)}
                              calendarEvents={calendarEvents}
                            />
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="email">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Correos del día</CardTitle>
                    <CardDescription>
                      {format(selectedDate, 'EEEE d MMMM, yyyy', { locale: es })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {emailsForSelectedDate.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Mail className="mx-auto h-12 w-12 opacity-20 mb-2" />
                        <p>No hay correos para este día</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {emailsForSelectedDate.map(email => (
                          <EmailCard 
                            key={email.id} 
                            email={email} 
                            notes={notes}
                            onLinkNote={(noteId) => linkEmailToNote(noteId, email.id)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Correos por procesar</CardTitle>
                      <CardDescription>
                        Correos sin vinculación
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {emails.filter(e => !e.linkedNoteId && !e.linkedEventId).length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay correos sin vincular</p>
                      ) : (
                        <div className="space-y-4">
                          {emails
                            .filter(e => !e.linkedNoteId && !e.linkedEventId)
                            .slice(0, 3)
                            .map(email => (
                              <EmailWithMatches 
                                key={email.id} 
                                email={email} 
                                matches={findMatchesForEmail(email.id)}
                                notes={notes}
                                calendarEvents={calendarEvents}
                                onLinkNote={(noteId) => linkEmailToNote(noteId, email.id)}
                              />
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

interface EventCardProps {
  event: CalendarEvent;
  notes: Note[];
  onLinkNote: (noteId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, notes, onLinkNote }) => {
  const linkedNote = notes.find(n => n.id === event.linkedNoteId);
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{event.title}</h3>
          {event.description && <p className="text-sm text-gray-500 mt-1">{event.description}</p>}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">
            {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
          </p>
          {event.location && <p className="text-xs text-gray-500">{event.location}</p>}
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-1">
        {event.attendees?.map((attendee, i) => (
          <Badge key={i} variant="outline" className="text-xs">{attendee}</Badge>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t">
        {linkedNote ? (
          <div className="bg-gray-50 p-3 rounded text-sm">
            <div className="flex justify-between">
              <p className="font-medium text-xs text-gray-500 mb-1">Nota vinculada</p>
            </div>
            <p className="text-gray-700">{linkedNote.content}</p>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">No hay nota vinculada</p>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Vincular nota</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command>
                  <CommandList>
                    <CommandEmpty>No hay notas disponibles</CommandEmpty>
                    <CommandGroup>
                      {notes.map((note) => (
                        <CommandItem 
                          key={note.id}
                          onSelect={() => onLinkNote(note.id)}
                          className="cursor-pointer"
                        >
                          <span className="truncate">{note.content}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

interface EmailCardProps {
  email: Email;
  notes: Note[];
  onLinkNote: (noteId: string) => void;
}

const EmailCard: React.FC<EmailCardProps> = ({ email, notes, onLinkNote }) => {
  const linkedNote = notes.find(n => n.id === email.linkedNoteId);
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{email.subject}</h3>
        <p className="text-xs text-gray-500">
          {format(email.receivedAt, 'HH:mm')}
        </p>
      </div>
      
      <div className="mt-1 flex justify-between">
        <p className="text-sm text-gray-700">{email.sender}</p>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{email.content}</p>
      
      <div className="mt-4 pt-3 border-t">
        {linkedNote ? (
          <div className="bg-gray-50 p-3 rounded text-sm">
            <div className="flex justify-between">
              <p className="font-medium text-xs text-gray-500 mb-1">Nota vinculada</p>
            </div>
            <p className="text-gray-700">{linkedNote.content}</p>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">No hay nota vinculada</p>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Vincular nota</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command>
                  <CommandList>
                    <CommandEmpty>No hay notas disponibles</CommandEmpty>
                    <CommandGroup>
                      {notes.map((note) => (
                        <CommandItem 
                          key={note.id}
                          onSelect={() => onLinkNote(note.id)}
                          className="cursor-pointer"
                        >
                          <span className="truncate">{note.content}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

interface NoteWithMatchesProps {
  note: Note;
  matches: MatchResult[];
  calendarEvents: CalendarEvent[];
}

const NoteWithMatches: React.FC<NoteWithMatchesProps> = ({ note, matches, calendarEvents }) => {
  const eventMatches = matches.filter(m => m.eventId);
  
  return (
    <div className="border rounded-lg p-3">
      <p className="text-sm mb-2">{note.content}</p>
      
      {eventMatches.length > 0 ? (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Posibles coincidencias:</p>
          <div className="space-y-1">
            {eventMatches.map((match, index) => {
              const event = calendarEvents.find(e => e.id === match.eventId);
              if (!event) return null;
              
              return (
                <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-1.5 rounded">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <span className="text-gray-500">
                      {format(event.startTime, 'HH:mm')}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {match.confidence}% 
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500">Sin coincidencias</p>
      )}
    </div>
  );
};

interface EmailWithMatchesProps {
  email: Email;
  matches: MatchResult[];
  notes: Note[];
  calendarEvents: CalendarEvent[];
  onLinkNote: (noteId: string) => void;
}

const EmailWithMatches: React.FC<EmailWithMatchesProps> = ({ 
  email, matches, notes, calendarEvents, onLinkNote 
}) => {
  const noteMatches = matches.filter(m => m.noteId);
  const eventMatches = matches.filter(m => m.eventId);
  
  return (
    <div className="border rounded-lg p-3">
      <p className="font-medium text-sm">{email.subject}</p>
      <p className="text-xs text-gray-500 mb-2">{email.sender}</p>
      
      {noteMatches.length > 0 || eventMatches.length > 0 ? (
        <div className="space-y-2">
          {noteMatches.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Notas relacionadas:</p>
              {noteMatches.map((match, index) => {
                const note = notes.find(n => n.id === match.noteId);
                if (!note) return null;
                
                return (
                  <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded mb-1">
                    <p className="truncate">{note.content}</p>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2"
                      onClick={() => onLinkNote(note.id)}
                    >
                      <Link2 className="h-3 w-3 mr-1" />
                      <span className="text-[10px]">Vincular</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          
          {eventMatches.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Eventos relacionados:</p>
              {eventMatches.map((match, index) => {
                const event = calendarEvents.find(e => e.id === match.eventId);
                if (!event) return null;
                
                return (
                  <div key={index} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded mb-1">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-gray-500">
                        {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {match.confidence}% 
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-500">Sin coincidencias</p>
      )}
    </div>
  );
};

export default IntegrationsPage;
