
import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Mail, RefreshCw, User, Users, AlertCircle, Phone, Building, Plus } from "lucide-react";
import { fetchIntegratedCalendarData } from "@/integrations/google/googleApi";
import { useIntegrations } from "@/context/IntegrationsContext";
import { useCrm } from "@/context/CrmContext";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IntegratedEvent {
  id: string;
  tipo: "Evento" | "Tarea" | "Agenda de citas";
  titulo: string;
  fecha: string;
  hora_fin: string;
  participantes: string[];
  descripcion: string;
  contacto_vinculado: {
    id?: string;
    nombre: string;
    email: string;
    phone?: string;
    company?: string;
    photo_url?: string;
    google_id?: string;
  } | null;
  accion: "vinculado" | "importado_al_crm" | null;
  event_data: any;
}

interface GoogleContact {
  google_id: string;
  name: string;
  email: string;
  phone?: string;
  photo_url?: string;
  company?: string;
  source: 'google';
}

const GoogleIntegratedCalendar: React.FC = () => {
  const [events, setEvents] = useState<IntegratedEvent[]>([]);
  const [googleContacts, setGoogleContacts] = useState<GoogleContact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { isGoogleConnected } = useIntegrations();
  const { contacts, addContact } = useCrm();
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
      const result = await fetchIntegratedCalendarData(contacts);
      setEvents(result.events);
      setGoogleContacts(result.googleContacts);
      
      toast({
        title: "Calendario integrado sincronizado",
        description: `Se han cargado ${result.events.length} eventos y ${result.googleContacts.length} contactos de Google`,
      });
    } catch (error) {
      console.error("Error fetching integrated calendar data:", error);
      toast({
        title: "Error al cargar datos integrados",
        description: error instanceof Error ? error.message : "No se pudieron cargar los eventos y contactos",
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
  }, {} as Record<string, IntegratedEvent[]>);

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
  
  const getActionBadgeColor = (accion: string | null) => {
    switch (accion) {
      case "vinculado":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "importado_al_crm":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleImportContact = async (contact: any) => {
    try {
      await addContact({
        name: contact.nombre,
        email: contact.email,
        phone: contact.phone || "",
        company: contact.company || "",
        notes: `Importado automáticamente desde Google Contacts`
      });
      
      toast({
        title: "Contacto importado",
        description: `${contact.nombre} ha sido agregado a tus contactos del CRM`,
      });
      
      // Refresh data
      fetchEvents();
    } catch (error) {
      console.error("Error importing contact:", error);
      toast({
        title: "Error al importar contacto",
        description: error instanceof Error ? error.message : "No se pudo importar el contacto",
        variant: "destructive"
      });
    }
  };

  if (!isGoogleConnected) {
    return (
      <Alert className="mb-4 mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No conectado a Google</AlertTitle>
        <AlertDescription>
          Conecta tu cuenta de Google para ver tu calendario clasificado e integrado con tus contactos
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Calendario Integrado</h2>
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
                          <div className="space-y-1">
                            <CardTitle className="text-base font-medium">
                              {event.titulo}
                            </CardTitle>
                            <CardDescription className="flex items-center text-sm">
                              <Clock className="h-3.5 w-3.5 mr-1 text-gray-500" />
                              {format(new Date(event.fecha), 'HH:mm')} - 
                              {format(new Date(event.hora_fin), 'HH:mm')}
                            </CardDescription>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getTypeBadgeColor(event.tipo)}>
                              {event.tipo}
                            </Badge>
                            {event.accion && (
                              <Badge className={getActionBadgeColor(event.accion)}>
                                {event.accion === "vinculado" ? "Vinculado" : "Por importar"}
                              </Badge>
                            )}
                          </div>
                        </div>
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
                      
                      <CardFooter className="pt-3 border-t">
                        {event.contacto_vinculado ? (
                          <div className="w-full">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarImage src={event.contacto_vinculado.photo_url || ""} />
                                  <AvatarFallback className="bg-blue-100 text-blue-800">
                                    {event.contacto_vinculado.nombre.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{event.contacto_vinculado.nombre}</p>
                                  
                                  {event.contacto_vinculado.email && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Mail className="h-3 w-3 mr-1" />
                                      {event.contacto_vinculado.email}
                                    </div>
                                  )}
                                  
                                  {event.contacto_vinculado.phone && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Phone className="h-3 w-3 mr-1" />
                                      {event.contacto_vinculado.phone}
                                    </div>
                                  )}

                                  {event.contacto_vinculado.company && (
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Building className="h-3 w-3 mr-1" />
                                      {event.contacto_vinculado.company}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {event.accion === "importado_al_crm" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="ml-2"
                                  onClick={() => handleImportContact(event.contacto_vinculado)}
                                >
                                  <Plus className="h-3.5 w-3.5 mr-1" />
                                  Importar
                                </Button>
                              )}
                            </div>
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

export default GoogleIntegratedCalendar;
