
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Mail, AlertCircle, CheckCircle, RefreshCw, ExternalLink, CheckSquare, XCircle, Contact } from "lucide-react";
import { googleClient } from '../../integrations/google/googleClient';
import { useIntegrations } from '../../context/IntegrationsContext';

const GoogleIntegration: React.FC = () => {
  const { 
    isGoogleConnected, 
    connectGoogleCalendar, 
    disconnectGoogleCalendar, 
    syncCalendarEvents, 
    syncEmails, 
    syncTasks, 
    syncContacts,
    syncState 
  } = useIntegrations();
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncingCalendar, setIsSyncingCalendar] = useState(false);
  const [isSyncingEmails, setIsSyncingEmails] = useState(false);
  const [isSyncingTasks, setIsSyncingTasks] = useState(false);
  const [isSyncingContacts, setIsSyncingContacts] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for auth errors in local storage
  useEffect(() => {
    const googleAuthError = localStorage.getItem('google_auth_error');
    if (googleAuthError) {
      setConnectionError(googleAuthError);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: googleAuthError,
      });
      // Clear the error
      localStorage.removeItem('google_auth_error');
    }
  }, [toast]);

  const handleConnect = async () => {
    setIsLoading(true);
    setConnectionError(null);
    try {
      await connectGoogleCalendar();
      toast({
        title: "Conectado con éxito",
        description: "Tu cuenta de Google ha sido conectada correctamente",
      });
    } catch (error) {
      console.error('Error connecting to Google:', error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido al conectar con Google";
      setConnectionError(errorMessage);
      localStorage.setItem('google_auth_error', errorMessage);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await disconnectGoogleCalendar();
      toast({
        title: "Desconectado con éxito",
        description: "Tu cuenta de Google ha sido desconectada correctamente",
      });
      setConnectionError(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo desconectar tu cuenta de Google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncCalendar = async () => {
    setIsSyncingCalendar(true);
    try {
      await syncCalendarEvents();
      toast({
        title: "Sincronización completada",
        description: "Tus eventos de calendario han sido sincronizados con éxito",
      });
    } catch (error) {
      console.error('Error syncing calendar:', error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast({
        variant: "destructive",
        title: "Error de sincronización",
        description: `No se pudieron sincronizar tus eventos de calendario: ${errorMessage}`,
      });
    } finally {
      setIsSyncingCalendar(false);
    }
  };

  const handleSyncEmails = async () => {
    setIsSyncingEmails(true);
    try {
      await syncEmails();
      toast({
        title: "Sincronización completada",
        description: "Tus correos han sido sincronizados con éxito",
      });
    } catch (error) {
      console.error('Error syncing emails:', error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast({
        variant: "destructive",
        title: "Error de sincronización",
        description: `No se pudieron sincronizar tus correos: ${errorMessage}`,
      });
    } finally {
      setIsSyncingEmails(false);
    }
  };

  const handleSyncTasks = async () => {
    setIsSyncingTasks(true);
    try {
      await syncTasks();
      toast({
        title: "Sincronización completada",
        description: "Tus tareas han sido sincronizadas con éxito",
      });
    } catch (error) {
      console.error('Error syncing tasks:', error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast({
        variant: "destructive",
        title: "Error de sincronización",
        description: `No se pudieron sincronizar tus tareas: ${errorMessage}`,
      });
    } finally {
      setIsSyncingTasks(false);
    }
  };

  const handleSyncContacts = async () => {
    setIsSyncingContacts(true);
    try {
      await syncContacts();
      toast({
        title: "Sincronización completada", 
        description: "Tus contactos han sido sincronizados con éxito",
      });
    } catch (error) {
      console.error('Error syncing contacts:', error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast({
        variant: "destructive",
        title: "Error de sincronización",
        description: `No se pudieron sincronizar tus contactos: ${errorMessage}`,
      });
    } finally {
      setIsSyncingContacts(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Integración con Google</CardTitle>
            <CardDescription>Conecta tu cuenta de Google para sincronizar calendarios, tareas, correos y contactos</CardDescription>
          </div>
          {isGoogleConnected && (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
              <CheckCircle className="h-3 w-3 mr-1" /> Conectado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {connectionError && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error de conexión</AlertTitle>
            <AlertDescription>
              {connectionError}
              <p className="mt-2 text-sm">
                Asegúrate de que has habilitado las APIs necesarias en tu proyecto de Google Cloud
                y que los permisos de OAuth están configurados correctamente.
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Estado de la integración</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Esta integración usa directamente las APIs de Google para sincronizar tu información usando OAuth.
            </p>
            <p>Para una funcionalidad completa:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Asegúrate de tener los permisos de Calendar, Tasks, Gmail y People activados</li>
              <li>Si encuentras problemas, revisa la consola para más detalles</li>
              <li>Verifica que las redirecciones de OAuth estén correctamente configuradas</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <div className="font-medium">Google Calendar</div>
              <div className="text-sm text-gray-500">
                {syncState.lastCalendarSync ? 
                  `Última sincronización: ${new Date(syncState.lastCalendarSync).toLocaleString()}` : 
                  "No sincronizado aún"}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-gray-500" />
            <div>
              <div className="font-medium">Google Tasks</div>
              <div className="text-sm text-gray-500">
                {syncState.lastTasksSync ? 
                  `Última sincronización: ${new Date(syncState.lastTasksSync).toLocaleString()}` : 
                  "No sincronizado aún"}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <div className="font-medium">Google Mail</div>
              <div className="text-sm text-gray-500">
                {syncState.lastEmailSync ? 
                  `Última sincronización: ${new Date(syncState.lastEmailSync).toLocaleString()}` : 
                  "No sincronizado aún"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Contact className="h-5 w-5 text-gray-500" />
            <div>
              <div className="font-medium">Google Contacts</div>
              <div className="text-sm text-gray-500">
                {syncState.lastContactsSync ? 
                  `Última sincronización: ${new Date(syncState.lastContactsSync).toLocaleString()}` : 
                  "No sincronizado aún"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-end gap-3">
        {isGoogleConnected ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleSyncCalendar} 
              disabled={isSyncingCalendar}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncingCalendar ? "animate-spin" : ""}`} />
              Sincronizar Calendario
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSyncTasks}
              disabled={isSyncingTasks}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncingTasks ? "animate-spin" : ""}`} />
              Sincronizar Tareas
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSyncEmails}
              disabled={isSyncingEmails}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncingEmails ? "animate-spin" : ""}`} />
              Sincronizar Correos
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSyncContacts}
              disabled={isSyncingContacts}
              className="flex-1 sm:flex-none"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncingContacts ? "animate-spin" : ""}`} />
              Sincronizar Contactos
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDisconnect}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              Desconectar
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? "Conectando..." : "Conectar con Google"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default GoogleIntegration;
