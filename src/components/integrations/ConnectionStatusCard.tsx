
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckSquare, Mail, RefreshCw } from "lucide-react";
import { IntegrationSyncState } from "@/types/integrations";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface ConnectionStatusCardProps {
  isGoogleConnected: boolean;
  syncState: IntegrationSyncState;
  connecting: boolean;
  syncingCalendar: boolean;
  syncingTasks: boolean;
  syncingEmail: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onSyncCalendar: () => void;
  onSyncTasks: () => void;
  onSyncEmail: () => void;
}

const ConnectionStatusCard: React.FC<ConnectionStatusCardProps> = ({
  isGoogleConnected,
  syncState,
  connecting,
  syncingCalendar,
  syncingTasks,
  syncingEmail,
  onConnect,
  onDisconnect,
  onSyncCalendar,
  onSyncTasks,
  onSyncEmail,
}) => {
  return (
    <Card className="mb-8 overflow-hidden border-t-4 border-t-primary">
      <CardHeader>
        <CardTitle className="flex items-center">
          Estado de Conexión
          {isGoogleConnected && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 ml-2"
            >
              Conectado
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Conecta tu cuenta de Google para sincronizar tu calendario, tareas y
          correos
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Calendar Connection */}
        <div className="flex items-center justify-between p-4 border rounded-lg mb-4 bg-white hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium">Google Calendar</h3>
              <p className="text-sm text-gray-500">
                {isGoogleConnected
                  ? `Conectado ${
                      syncState.lastCalendarSync
                        ? "· Sincronizado " +
                          formatDistanceToNow(
                            typeof syncState.lastCalendarSync === "string"
                              ? parseISO(syncState.lastCalendarSync)
                              : syncState.lastCalendarSync,
                            { addSuffix: true, locale: es }
                          )
                        : "· Nunca sincronizado"
                    }`
                  : "No conectado"}
              </p>
            </div>
          </div>
          {!connecting && (
            <Button
              variant={isGoogleConnected ? "outline" : "default"}
              onClick={isGoogleConnected ? onDisconnect : onConnect}
              className={isGoogleConnected ? "" : "bg-blue-600 hover:bg-blue-700"}
            >
              {isGoogleConnected ? "Desconectar" : "Conectar"}
            </Button>
          )}
          {connecting && (
            <Button variant="default" disabled className="bg-blue-600">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Conectando...
            </Button>
          )}
        </div>

        {/* Tasks Connection */}
        <div className="flex items-center justify-between p-4 border rounded-lg mb-4 bg-white hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-medium">Google Tasks</h3>
              <p className="text-sm text-gray-500">
                {isGoogleConnected
                  ? `Conectado ${
                      syncState.lastTasksSync
                        ? "· Sincronizado " +
                          formatDistanceToNow(
                            typeof syncState.lastTasksSync === "string"
                              ? parseISO(syncState.lastTasksSync)
                              : syncState.lastTasksSync,
                            { addSuffix: true, locale: es }
                          )
                        : "· Nunca sincronizado"
                    }`
                  : "No conectado"}
              </p>
            </div>
          </div>
          {!connecting && (
            <Button
              variant={isGoogleConnected ? "outline" : "default"}
              onClick={isGoogleConnected ? onDisconnect : onConnect}
              className={isGoogleConnected ? "" : "bg-green-600 hover:bg-green-700"}
            >
              {isGoogleConnected ? "Desconectar" : "Conectar"}
            </Button>
          )}
          {connecting && (
            <Button variant="default" disabled className="bg-green-600">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Conectando...
            </Button>
          )}
        </div>

        {/* Email Connection */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-medium">Google Mail</h3>
              <p className="text-sm text-gray-500">
                {isGoogleConnected
                  ? `Conectado ${
                      syncState.lastEmailSync
                        ? "· Sincronizado " +
                          formatDistanceToNow(
                            typeof syncState.lastEmailSync === "string"
                              ? parseISO(syncState.lastEmailSync)
                              : syncState.lastEmailSync,
                            { addSuffix: true, locale: es }
                          )
                        : "· Nunca sincronizado"
                    }`
                  : "No conectado"}
              </p>
            </div>
          </div>
          {!connecting && (
            <Button
              variant={isGoogleConnected ? "outline" : "default"}
              onClick={isGoogleConnected ? onDisconnect : onConnect}
              className={isGoogleConnected ? "" : "bg-red-600 hover:bg-red-700"}
            >
              {isGoogleConnected ? "Desconectar" : "Conectar"}
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
              Última sincronización completa:{" "}
              {syncState.lastCalendarSync && syncState.lastEmailSync && syncState.lastTasksSync
                ? formatDistanceToNow(
                    new Date(
                      Math.min(
                        new Date(syncState.lastCalendarSync).getTime(),
                        new Date(syncState.lastEmailSync).getTime(),
                        new Date(syncState.lastTasksSync || 0).getTime()
                      )
                    ),
                    { addSuffix: true, locale: es }
                  )
                : "Nunca"}
            </span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-wrap">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={onSyncCalendar}
              disabled={!isGoogleConnected || syncingCalendar}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${syncingCalendar ? "animate-spin" : ""}`}
              />{" "}
              Sincronizar Calendario
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={onSyncTasks}
              disabled={!isGoogleConnected || syncingTasks}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${syncingTasks ? "animate-spin" : ""}`}
              />{" "}
              Sincronizar Tareas
            </Button>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={onSyncEmail}
              disabled={!isGoogleConnected || syncingEmail}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${syncingEmail ? "animate-spin" : ""}`}
              />{" "}
              Sincronizar Correos
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ConnectionStatusCard;
