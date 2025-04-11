
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Mail, RefreshCw, User, Users, AlertCircle } from "lucide-react";
import { fetchClassifiedCalendarEvents } from "@/integrations/google/googleApi";
import { useIntegrations } from "@/context/IntegrationsContext";
import { useCrm } from "@/context/CrmContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ClassifiedEvent {
  id: string;
  tipo: "Evento" | "Tarea" | "Agenda de citas";
  titulo: string;
  fecha: string;
  hora_fin: string;
  participantes: string[];
  descripcion: string;
  contacto_vinculado: {
    id: string;
    nombre: string;
    email: string;
    match_type: string;
  } | null;
  event_data: any;
}

const GoogleClassifiedCalendar: React.FC = () => {
  const [events, setEvents] = useState<ClassifiedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { isGoogleConnected } = useIntegrations();
  const { contacts } = useCrm();
  const { toast } = useToast();

  const fetchEvents = async () => {
    if (!isGoogleConnected) {
      toast({
        title: "No conectado a Google",
        description: "Primero debes conectar tu cuenta de Google para ver tu calendario",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const fetchedEvents = await fetchClassifiedCalendarEvents(contacts);
      setEvents(fetchedEvents);
      toast({
        title: "Calendario sincronizado",
        description: `Se han cargado ${fetchedEvents.length} eventos de tu calendario de Google`,
      });
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      toast({
        title: "Error al cargar eventos",
        description: error instanceof Error ? error.message : "No se pudieron cargar los eventos del calendario",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isGoogleConnected) {
      fetchEvents();
    }
  }, [isGoogleConnected]);

  // Filter events based on the active tab
  const filteredEvents = activeTab === "all" 
    ? events 
    : events.filter(event => event.tipo.toLowerCase() === activeTab.toLowerCase());

  // Group events by date for better display
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const eventDate = new Date(event.fecha);
    const dateKey = format(eventDate, 'yyyy-MM-dd');
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, ClassifiedEvent[]>);

  // Sort dates for display
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  const getTypeBadgeColor = (tipo: string) => {
    switch (tipo) {
      case "Evento":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Tarea":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "Agenda de citas":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  if (!isGoogleConnected) {
    return (
      <Alert className="mb-4 mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No conectado a Google</AlertTitle>
        <AlertDescription>
          Conecta tu cuenta de Google para ver tu calendario clasificado
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Calendario Clasificado</h2>
        <Button 
          onClick={fetchEvents} 
          size="sm" 
          variant="outline"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">
            Todos ({events.length})
          </TabsTrigger>
          <TabsTrigger value="evento">
            Eventos ({events.filter(e => e.tipo === "Evento").length})
          </TabsTrigger>
          <TabsTrigger value="tarea">
            Tareas ({events.filter(e => e.tipo === "Tarea").length})
          </TabsTrigger>
          <TabsTrigger value="agenda de citas">
            Citas ({events.filter(e => e.tipo === "Agenda de citas").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="animate-spin h-8 w-8 text-gray-400" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <p>No hay eventos {activeTab !== "all" ? `de tipo ${activeTab}` : ""} en los próximos 30 días</p>
            </div>
          ) : (
            sortedDates.map(dateKey => (
              <div key={dateKey} className="mb-6">
                <h3 className="font-medium text-lg mb-2 text-gray-700 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                  {format(new Date(dateKey), 'EEEE, d MMMM yyyy', { locale: es })}
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {groupedEvents[dateKey].map(event => (
                    <Card key={event.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base font-medium">
                            {event.titulo}
                          </CardTitle>
                          <Badge className={getTypeBadgeColor(event.tipo)}>
                            {event.tipo}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center mt-1 text-sm">
                          <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          {format(new Date(event.fecha), 'HH:mm')} - 
                          {format(new Date(event.hora_fin), 'HH:mm')}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="py-0">
                        {event.descripcion && (
                          <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                            {event.descripcion}
                          </p>
                        )}
                        
                        {event.participantes && event.participantes.length > 0 && (
                          <div className="flex items-center text-xs text-gray-600 mb-2">
                            <Users className="h-3.5 w-3.5 mr-1" />
                            <span>{event.participantes.length} participantes</span>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="pt-3 border-t flex flex-col items-start">
                        {event.contacto_vinculado ? (
                          <div className="flex items-center space-x-1 text-xs text-green-600 w-full">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span className="font-medium">Vinculado a:</span>
                            <span>{event.contacto_vinculado.nombre}</span>
                            {event.contacto_vinculado.email && (
                              <span className="flex items-center">
                                <Mail className="h-3 w-3 mx-1" />
                                {event.contacto_vinculado.email.substring(0, 15)}
                                {event.contacto_vinculado.email.length > 15 ? '...' : ''}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="h-3.5 w-3.5 mr-1" />
                            <span>Sin contacto vinculado</span>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoogleClassifiedCalendar;
