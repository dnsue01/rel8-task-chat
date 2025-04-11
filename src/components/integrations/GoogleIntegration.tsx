
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Mail, AlertCircle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react";
import { googleClient } from '../../integrations/google/googleClient';
import { useIntegrations } from '../../context/IntegrationsContext';
import { supabase } from "@/integrations/supabase/client";

const GoogleIntegration: React.FC = () => {
  const { isGoogleConnected, connectGoogleCalendar, disconnectGoogleCalendar, syncCalendarEvents, syncState } = useIntegrations();
  const [isLoading, setIsLoading] = useState(false);
  const [isEdgeFunctionTesting, setIsEdgeFunctionTesting] = useState(false);
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

  const testEdgeFunction = async () => {
    setIsEdgeFunctionTesting(true);
    try {
      // For demonstration purposes; in a real app you'd use the actual access token from auth
      const mockToken = "mock-access-token";
      
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('google-oauth', {
        body: { 
          access_token: mockToken,
          endpoint: "calendar" 
        }
      });
      
      if (error) {
        console.error('Edge function error:', error);
        toast({
          variant: "destructive",
          title: "Error en Edge Function",
          description: "No se pudo llamar a la función de Edge. Revisa la consola para más detalles.",
        });
        return;
      }

      console.log("Edge function response:", data);
      
      // Since we're using a mock token, we'll likely get an auth error from Google
      // But this shows the function is working
      toast({
        title: "Edge Function ejecutada",
        description: "La función de Edge ha sido llamada correctamente. Revisa la consola para ver la respuesta.",
      });
    } catch (error) {
      console.error('Error calling edge function:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error al llamar a la función Edge",
      });
    } finally {
      setIsEdgeFunctionTesting(false);
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
          <AlertTitle>Estado de la integración</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              Esta es una <strong>demostración simulada</strong> de la integración con Google.
            </p>
            <p>Para una implementación real:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Usa la API de Google Calendar y Tasks vía Supabase Edge Functions</li>
              <li>Maneja OAuth de forma segura</li>
              <li>Sincroniza tus datos en tiempo real</li>
            </ul>
            <p className="mt-2">
              Para configurar completamente, necesitas:
            </p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Crear un proyecto en 
                <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
                  Google Cloud Console
                </a>
              </li>
              <li>Activar las APIs necesarias (Calendar, Tasks, Gmail)</li>
              <li>Configurar las credenciales OAuth 2.0</li>
              <li>Configurar los dominios autorizados y URLs de redirección</li>
            </ol>
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

        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <ExternalLink className="h-4 w-4 mr-1" /> Edge Function (Backend Seguro)
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Las Edge Functions de Supabase permiten manejar tokens de forma segura y hacer llamadas a las APIs de Google sin exponer credenciales en el frontend.
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={testEdgeFunction}
            disabled={isEdgeFunctionTesting}
            className="w-full"
          >
            {isEdgeFunctionTesting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Probando Edge Function...
              </>
            ) : (
              <>
                Probar Edge Function
              </>
            )}
          </Button>
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
