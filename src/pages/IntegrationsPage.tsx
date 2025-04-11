import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { useIntegrations } from "../context/IntegrationsContext";
import { useCrm } from "../context/CrmContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, RefreshCw, Link2, AlertTriangle, ExternalLink, Globe, ChevronRight, Info } from "lucide-react";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarEvent, Email, MatchResult } from "../types/integrations";
import { Note } from "../types/index";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [connecting, setConnecting] = useState<boolean>(false);

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

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await connectGoogleCalendar();
    } finally {
      setConnecting(false);
    }
  };
  
  const eventsForSelectedDate = getEventsForDate(selectedDate);
  const emailsForSelectedDate = getEmailsForDate(selectedDate);
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Integraciones</h1>
        <p className="text-gray-500 mb-6">Conecta tus servicios de Google para sincronizar tu información</p>
        
        {/* Integration Status Alert */}
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>Estado de la integración</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Esta es una <strong>demostración simulada</strong> de la integración con Google. En una aplicación de producción:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-2">
              <li>La aplicación utilizaría la API de Google a través de Supabase Edge Functions</li>
              <li>El proceso de OAuth de Google sería manejado de forma segura</li>
              <li>Tus datos se sincronizarían en tiempo real desde tu cuenta real</li>
            </ul>
            <p>
              Para implementar esta funcionalidad completamente, necesitarías configurar claves de API de Google
              en Supabase y crear Edge Functions seguras para la comunicación con las APIs de Google.
            </p>
          </AlertDescription>
        </Alert>
        
        {/* Connection Status Card */}
        <Card className="mb-8 overflow-hidden border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center">
              Estado de Conexión
              {isGoogleConnected && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-2">
                  Conectado
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Conecta tu cuenta de Google para sincronizar tu calendario y correos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg mb-4 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">Google Calendar</h3>
                  <p className="text-sm text-gray-500">
                    {isGoogleConnected 
                      ? `Conectado ${syncState.lastCalendarSync 
                          ? '· Sincronizado ' + formatDistanceToNow(
                              typeof syncState.lastCalendarSync === 'string' 
                                ? parseISO(syncState.lastCalendarSync) 
                                : syncState.lastCalendarSync, 
                              { addSuffix: true, locale: es }
                            )
                          : '· Nunca sincronizado'}`
                      : 'No conectado'}
                  </p>
                </div>
              </div>
              {!connecting && (
                <Button 
                  variant={isGoogleConnected ? "outline" : "default"}
                  onClick={isGoogleConnected ? disconnectGoogleCalendar : handleConnect}
                  className={isGoogleConnected ? "" : "bg-blue-600 hover:bg-blue-700"}
                >
                  {isGoogleConnected ? 'Desconectar' : 'Conectar'}
                </Button>
              )}
              {connecting && (
                <Button variant="default" disabled className="bg-blue-600">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
                  Conectando...
                </Button>
              )}
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium">Google Mail</h3>
                  <p className="text-sm text-gray-500">
                    {isGoogleConnected 
                      ? `Conectado ${syncState.lastEmailSync 
                          ? '· Sincronizado ' + formatDistanceToNow(
                              typeof syncState.lastEmailSync === 'string' 
                                ? parseISO(syncState.lastEmailSync) 
                                : syncState.lastEmailSync, 
                              { addSuffix: true, locale: es }
                            )
                          : '· Nunca sincronizado'}`
                      : 'No conectado'}
                  </p>
                </div>
              </div>
              {!connecting && (
                <Button 
                  variant={isGoogleConnected ? "outline" : "default"}
                  onClick={isGoogleConnected ? disconnectGoogleCalendar : handleConnect}
                  className={isGoogleConnected ? "" : "bg-red-600 hover:bg-red-700"}
                >
                  {isGoogleConnected ? 'Desconectar' : 'Conectar'}
                </Button>
              )}
              {connecting && (
                <Button variant="default" disabled className="bg-red-600">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> 
                  Conectando...
                </Button>
              )}
            </div>
          </CardContent>
          {isGoogleConnected && (
            <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between bg-gray-50 border-t">
              <div className="text-sm text-gray-500">
                <span className="block sm:inline mr-4">
                  Última sincronización completa: {
                    syncState.lastCalendarSync && syncState.lastEmailSync
                      ? formatDistanceToNow(
                          new Date(Math.min(
                            new Date(syncState.lastCalendarSync).getTime(),
                            new Date(syncState.lastEmailSync).getTime()
                          )),
                          { addSuffix: true, locale: es }
                        )
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
          <Alert className="mb-8 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>Conecta tu cuenta de Google</AlertTitle>
            <AlertDescription>
              <p className="mb-4">
                Para utilizar la sincronización de calendario y correos, debes conectar tu cuenta de Google. 
                Al conectar tu cuenta, podrás:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Ver tus eventos de calendario directamente en la aplicación</li>
                <li>Vincular correos electrónicos con tus contactos y notas</li>
                <li>Recibir notificaciones de eventos importantes</li>
                <li>Mantener sincronizada toda tu información</li>
              </ul>
              <p className="mb-4">
                <strong>Nota:</strong> Esta es una demostración y por el momento usa datos simulados. 
                En una versión real, la aplicación:
              </p>
              <ul className="list-disc list-inside space-y-1 mb-4">
                <li>Te redirigiría al flujo de autenticación de Google</li>
                <li>Utilizaría Supabase Edge Functions para manejar la comunicación segura con las APIs</li>
                <li>Almacenaría de forma segura los tokens de acceso en tu base de datos Supabase</li>
              </ul>
              <Button 
                onClick={handleConnect} 
                className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={connecting}
              >
                {!connecting ? (
                  <>
                    <Globe className="mr-2 h-4 w-4" /> Conectar con Google (Simulación)
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Conectando...
                  </>
                )}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {isGoogleConnected ? (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="mb-6">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Calendario
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Correo
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="calendar" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
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
                        <Button 
                          variant="link" 
                          onClick={handleSyncCalendar}
                          disabled={syncingCalendar}
                          className="mt-2"
                        >
                          <RefreshCw className={`mr-2 h-3 w-3 ${syncingCalendar ? 'animate-spin' : ''}`} />
                          Sincronizar eventos
                        </Button>
                      </div>
                    ) : (
                      <ScrollArea className="h-[450px] pr-4">
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
                        <p className="text-gray-500 text-center py-4">No hay notas disponibles</p>
                      ) : (
                        <ScrollArea className="h-[300px] pr-2">
                          <div className="space-y-3">
                            {notes.slice(0, 5).map(note => (
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
            </TabsContent>
            
            <TabsContent value="email" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
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
                        <Button 
                          variant="link" 
                          onClick={handleSyncEmail}
                          disabled={syncingEmail}
                          className="mt-2"
                        >
                          <RefreshCw className={`mr-2 h-3 w-3 ${syncingEmail ? 'animate-spin' : ''}`} />
                          Sincronizar correos
                        </Button>
                      </div>
                    ) : (
                      <ScrollArea className="h-[450px] pr-4">
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
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Correos por procesar</CardTitle>
                      <CardDescription>
                        Correos sin vinculación
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {emails.filter(e => !e.linkedNoteId && !e.linkedEventId).length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay correos sin vincular</p>
                      ) : (
                        <ScrollArea className="h-[300px] pr-2">
                          <div className="space-y-3">
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
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="bg-white border shadow-sm overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-6">
                <h2 className="text-xl font-bold mb-3">¿Por qué conectar Google?</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Sincroniza tu <strong>calendario</strong> y mantén tus eventos organizados</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Vincula tus <strong>correos</strong> con contactos para un seguimiento eficiente</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Automatiza el <strong>registro de interacciones</strong> con tus contactos</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Recibe <strong>notificaciones</strong> de eventos importantes</span>
                  </li>
                </ul>
                
                <Button 
                  onClick={handleConnect} 
                  className="mt-6 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={connecting}
                >
                  {!connecting ? (
                    <>
                      <Globe className="h-4 w-4" /> Conectar con Google
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Conectando...
                    </>
                  )}
                </Button>
                
                <p className="mt-4 text-xs text-gray-500">
                  <strong>Nota:</strong> Esta es una demostración y por el momento usa datos simulados. 
                  En una versión real, te redirigiría al flujo de autenticación de Google.
                </p>
              </div>
              
              <div className="md:w-1/2 bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
                <div className="max-w-xs text-center">
                  <div className="mx-auto w-32 h-32 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-8 w-8 text-blue-500" />
                      <Mail className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Integración simplificada</h3>
                  <p className="text-sm text-gray-600">
                    Conéctate una vez y mantén toda tu información sincronizada automáticamente.
                  </p>
                </div>
              </div>
            </div>
          </Card>
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
