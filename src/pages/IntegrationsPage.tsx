import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { useIntegrations } from "../context/IntegrationsContext";
import { useCrm } from "../context/CrmContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, CheckSquare, RefreshCw, Link2, ExternalLink, Globe, ChevronRight, Info, UserPlus } from "lucide-react";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarEvent, Email, MatchResult, Task } from "../types/integrations";
import { Note } from "../types/index";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const IntegrationsPage: React.FC = () => {
  const { 
    isGoogleConnected, 
    connectGoogleCalendar, 
    disconnectGoogleCalendar,
    calendarEvents,
    emails,
    tasks,
    taskLists, 
    syncState,
    syncCalendarEvents,
    syncEmails,
    syncTasks,
    getEventsForDate,
    getEmailsForDate,
    linkNoteToEvent,
    linkEmailToNote,
    linkNoteToTask,
    findMatchesForNote,
    findMatchesForEmail
  } = useIntegrations();
  
  const { notes, getContactById, contacts, addTaskToContact } = useCrm();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState<string>("calendar");
  const [syncingCalendar, setSyncingCalendar] = useState<boolean>(false);
  const [syncingEmail, setSyncingEmail] = useState<boolean>(false);
  const [syncingTasks, setSyncingTasks] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSyncCalendar = async () => {
    setSyncingCalendar(true);
    try {
      await syncCalendarEvents();
    } finally {
      setSyncingCalendar(false);
    }
  };

  const handleSyncEmail = async () => {
    setSyncingEmail(true);
    try {
      await syncEmails();
    } finally {
      setSyncingEmail(false);
    }
  };

  const handleSyncTasks = async () => {
    setSyncingTasks(true);
    try {
      await syncTasks();
    } finally {
      setSyncingTasks(false);
    }
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
  const tasksForSelectedDate = tasks.filter(task => {
    if (!task.due) return false;
    const taskDate = new Date(task.due);
    return taskDate.getDate() === selectedDate.getDate() &&
           taskDate.getMonth() === selectedDate.getMonth() &&
           taskDate.getFullYear() === selectedDate.getFullYear();
  });
  
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Integraciones</h1>
        <p className="text-gray-500 mb-6">Conecta tus servicios de Google para sincronizar tu información</p>
        
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
              Conecta tu cuenta de Google para sincronizar tu calendario, tareas y correos
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

            <div className="flex items-center justify-between p-4 border rounded-lg mb-4 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckSquare className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium">Google Tasks</h3>
                  <p className="text-sm text-gray-500">
                    {isGoogleConnected 
                      ? `Conectado ${syncState.lastTasksSync 
                          ? '· Sincronizado ' + formatDistanceToNow(
                              typeof syncState.lastTasksSync === 'string' 
                                ? parseISO(syncState.lastTasksSync) 
                                : syncState.lastTasksSync, 
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
                  className={isGoogleConnected ? "" : "bg-green-600 hover:bg-green-700"}
                >
                  {isGoogleConnected ? 'Desconectar' : 'Conectar'}
                </Button>
              )}
              {connecting && (
                <Button variant="default" disabled className="bg-green-600">
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
                    syncState.lastCalendarSync && syncState.lastEmailSync && syncState.lastTasksSync
                      ? formatDistanceToNow(
                          new Date(Math.min(
                            new Date(syncState.lastCalendarSync).getTime(),
                            new Date(syncState.lastEmailSync).getTime(),
                            new Date(syncState.lastTasksSync || 0).getTime()
                          )),
                          { addSuffix: true, locale: es }
                        )
                      : 'Nunca'
                  }
                </span>
              </div>
              <div className="flex gap-2 w-full sm:w-auto flex-wrap">
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
                  onClick={handleSyncTasks}
                  disabled={!isGoogleConnected || syncingTasks}
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${syncingTasks ? 'animate-spin' : ''}`} /> 
                  Sincronizar Tareas
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
          <Card className="mb-8 bg-white border shadow-sm overflow-hidden">
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
                    <span>Gestiona tus <strong>tareas</strong> desde una única interfaz</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Vincula tus <strong>correos</strong> con contactos para un seguimiento eficiente</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span>Automatiza el <strong>registro de interacciones</strong> con tus contactos</span>
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
              </div>
              
              <div className="md:w-1/2 bg-gradient-to-br from-purple-50 to-blue-50 p-6 flex items-center justify-center">
                <div className="max-w-xs text-center">
                  <div className="mx-auto w-32 h-32 bg-white rounded-full shadow-md flex items-center justify-center mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-8 w-8 text-blue-500" />
                      <CheckSquare className="h-7 w-7 text-green-500" />
                      <Mail className="h-8 w-8 text-red-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Integración completa</h3>
                  <p className="text-sm text-gray-600">
                    Conéctate una vez y mantén toda tu información sincronizada automáticamente.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {isGoogleConnected ? (
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
            <TabsList className="mb-6">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Calendario
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" /> Tareas
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

            <TabsContent value="tasks" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle>Tareas</CardTitle>
                    <CardDescription>
                      Tus tareas pendientes de Google Tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tasks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CheckSquare className="mx-auto h-12 w-12 opacity-20 mb-2" />
                        <p>No hay tareas disponibles</p>
                        <Button 
                          variant="link" 
                          onClick={handleSyncTasks}
                          disabled={syncingTasks}
                          className="mt-2"
                        >
                          <RefreshCw className={`mr-2 h-3 w-3 ${syncingTasks ? 'animate-spin' : ''}`} />
                          Sincronizar tareas
                        </Button>
                      </div>
                    ) : (
                      <ScrollArea className="h-[450px] pr-4">
                        <div className="space-y-4">
                          {taskLists.map(taskList => (
                            <div key={taskList.id} className="mb-6">
                              <h3 className="text-lg font-medium mb-3 border-b pb-1">{taskList.title}</h3>
                              <div className="space-y-3">
                                {tasks
                                  .filter(task => task.listId === taskList.id)
                                  .map(task => (
                                    <TaskCard 
                                      key={task.id} 
                                      task={task} 
                                      notes={notes}
                                      onLinkNote={(noteId) => linkNoteToTask(noteId, task.id)}
                                    />
                                  ))
                                }
                                {tasks.filter(task => task.listId === taskList.id).length === 0 && (
                                  <div className="text-center py-3 text-gray-500 text-sm">
                                    No hay tareas en esta lista
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {taskLists.length === 0 && (
                            <div className="text-center py-3 text-gray-500">
                              No hay listas de tareas disponibles
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Tareas para hoy</CardTitle>
                      <CardDescription>
                        {format(selectedDate, 'd MMMM, yyyy', { locale: es })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {tasksForSelectedDate.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay tareas para hoy</p>
                      ) : (
                        <ScrollArea className="h-[300px] pr-2">
                          <div className="space-y-3">
                            {tasksForSelectedDate.map(task => (
                              <div key={task.id} className="border rounded-lg p-3">
                                <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                                {task.notes && <p className="text-sm text-gray-500 mt-1">{task.notes}</p>}
                                <Badge 
                                  variant={task.completed ? "outline" : "secondary"} 
                                  className="mt-2"
                                >
                                  {task.completed ? 'Completada' : 'Pendiente'}
                                </Badge>
                              </div>
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
        ) : null}
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

interface TaskCardProps {
  task: Task;
  notes: Note[];
  onLinkNote: (noteId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, notes, onLinkNote }) => {
  const { contacts } = useCrm();
  const { toast } = useToast();
  const linkedNote = notes.find(n => n.id === task.linkedNoteId);
  const [selectedContact, setSelectedContact] = useState<string | null>(task.contactAssociation?.selected || null);
  
  const handleContactSelect = (contactName: string) => {
    setSelectedContact(contactName);
    
    if (contactName !== "Nuevo contacto") {
      const contactMatch = contacts.find(contact => contact.name === contactName);
      if (contactMatch) {
        // Update the task with the contact association in local storage
        const updatedTasks = JSON.parse(localStorage.getItem('google_tasks') || '[]');
        const taskIndex = updatedTasks.findIndex((t: Task) => t.id === task.id);
        
        if (taskIndex !== -1) {
          updatedTasks[taskIndex].contactAssociation = {
            ...updatedTasks[taskIndex].contactAssociation,
            selected: contactName,
            contactId: contactMatch.id
          };
          localStorage.setItem('google_tasks', JSON.stringify(updatedTasks));
        }
        
        toast({
          title: "Contacto asociado",
          description: `La tarea "${task.title}" ha sido asociada a ${contactName}`,
        });
      }
    }
  };
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
          {task.notes && (
            <p className="text-sm text-gray-500 mt-1">
              {task.link ? (
                <>
                  {task.notes.replace(task.link, '')}
                  {task.notes.replace(task.link, '').length > 0 && <br />}
                </>
              ) : (
                task.notes
              )}
            </p>
          )}
          {task.link && (
            <a 
              href={task.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center mt-1"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              {task.link.length > 50 ? `${task.link.substring(0, 50)}...` : task.link}
            </a>
          )}
        </div>
        <div className="text-right">
          {task.due && (
            <p className="text-xs text-gray-500">
              Vence: {format(new Date(task.due), 'd MMM, yyyy', { locale: es })}
            </p>
          )}
          <Badge 
            variant={task.completed ? "outline" : "secondary"} 
            className="mt-1"
          >
            {task.completed ? 'Completada' : 'Pendiente'}
          </Badge>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <div className="flex items-center">
          <UserPlus className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-500">Contacto:</span>
        </div>
        <div>
          {selectedContact ? (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
              {selectedContact}
            </Badge>
          ) : task.contactAssociation && task.contactAssociation.options.length > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Asociar contacto <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[200px]" align="end">
                <Command>
                  <CommandList>
                    <CommandEmpty>Sin sugerencias</CommandEmpty>
                    <CommandGroup>
                      {task.contactAssociation.options.map((option, i) => (
                        <CommandItem 
                          key={i} 
                          onSelect={() => handleContactSelect(option)}
                          className="cursor-pointer"
                        >
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command
