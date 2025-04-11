
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Mail, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { googleClient } from '../../integrations/google/googleClient';
import { useIntegrations } from '../../context/IntegrationsContext';

const GoogleIntegration: React.FC = () => {
  const { isGoogleConnected, connectGoogleCalendar, disconnectGoogleCalendar, syncCalendarEvents, syncState } = useIntegrations();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // In our mock system this will just return a simulated success response
      // In the real implementation this would redirect to Google OAuth
      await connectGoogleCalendar();
      toast({
        title: "Conectado con éxito",
        description: "Tu cuenta de Google ha sido conectada correctamente",
      });
    } catch (error) {
      console.error('Error connecting to Google:', error);
      toast({
        variant: "destructive",
        title: "Error de conexión",
        description: "No se pudo conectar con Google. Inténtalo de nuevo.",
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

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await syncCalendarEvents();
      toast({
        title: "Sincronización completada",
        description: "Tus eventos han sido sincronizados con éxito",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de sincronización",
        description: "No se pudieron sincronizar tus eventos",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Integración con Google</CardTitle>
            <CardDescription>Conecta tu cuenta de Google para sincronizar calendarios y correos</CardDescription>
          </div>
          {isGoogleConnected && (
            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
              <CheckCircle className="h-3 w-3 mr-1" /> Conectado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuración para integración con Google</AlertTitle>
          <AlertDescription>
            Para usar la integración completa con Google, necesitas configurar un proyecto en la 
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
              Google Cloud Console
            </a>
            , activar las APIs necesarias y configurar el Client ID en el archivo googleClient.ts.
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        {isGoogleConnected ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleSync} 
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Sincronizar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDisconnect}
              disabled={isLoading}
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
