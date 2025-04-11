
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  Calendar,
  Mail,
  Home,
  Settings,
  MessageSquare,
} from "lucide-react";
import { useCrm } from "../../context/CrmContext";
import { useIntegrations } from "../../context/IntegrationsContext";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  currentUser: any;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const { logout } = useCrm();
  const { isGoogleConnected, syncState } = useIntegrations();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span
              onClick={() => navigate("/")}
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
            >
              CRM Personal
            </span>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="font-medium hover:bg-primary/10"
              >
                <Home className="h-4 w-4 mr-1" /> Inicio
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/app")}
                className="font-medium hover:bg-primary/10"
              >
                <User className="h-4 w-4 mr-1" /> Contactos
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/integrations")}
                      className="flex items-center gap-1 font-medium hover:bg-primary/10"
                    >
                      <div className="flex gap-1">
                        <Calendar className="h-4 w-4" />
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="ml-1">Integraciones</span>
                      {isGoogleConnected ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 text-xs ml-1 px-1.5 py-0"
                        >
                          Conectado
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 text-xs ml-1 px-1.5 py-0"
                        >
                          Desconectado
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
                    {isGoogleConnected ? (
                      <>
                        Último sincronizado:{" "}
                        {syncState.lastCalendarSync ? "Calendario ✓" : "Calendario ✗"} /{" "}
                        {syncState.lastEmailSync ? "Emails ✓" : "Emails ✗"}
                      </>
                    ) : (
                      "Conecta tu cuenta de Google para sincronizar calendario y correo"
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/ai-assistant")}
                className="font-medium hover:bg-primary/10"
              >
                <MessageSquare className="h-4 w-4 mr-1" /> Asistente IA
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
                className="font-medium hover:bg-primary/10"
              >
                <Settings className="h-4 w-4 mr-1" /> Configuración
              </Button>

              <div className="flex items-center border-l pl-4 ml-2">
                <div
                  className="flex items-center mr-4 cursor-pointer"
                  onClick={() => navigate("/settings")}
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src={currentUser.avatar_url || "/default-avatar.png"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">
                    {currentUser.name}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
