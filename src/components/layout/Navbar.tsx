
import React, { useState } from "react";
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
  Menu,
  X
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  currentUser: any;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const { logout } = useCrm();
  const { isGoogleConnected, syncState } = useIntegrations();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const NavItems = () => (
    <>
      <Button
        variant="ghost"
        size={isMobile ? "sm" : "sm"}
        onClick={() => {
          navigate("/");
          if (isMobile) setMobileMenuOpen(false);
        }}
        className="font-medium hover:bg-primary/10 w-full justify-start md:w-auto"
      >
        <Home className="h-4 w-4 mr-1" /> Inicio
      </Button>

      <Button
        variant="ghost"
        size={isMobile ? "sm" : "sm"}
        onClick={() => {
          navigate("/app");
          if (isMobile) setMobileMenuOpen(false);
        }}
        className="font-medium hover:bg-primary/10 w-full justify-start md:w-auto"
      >
        <User className="h-4 w-4 mr-1" /> Contactos
      </Button>

      <Button
        variant="ghost"
        size={isMobile ? "sm" : "sm"}
        onClick={() => {
          navigate("/integrations");
          if (isMobile) setMobileMenuOpen(false);
        }}
        className="font-medium hover:bg-primary/10 w-full justify-start md:w-auto flex items-center gap-1"
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

      <Button
        variant="ghost"
        size={isMobile ? "sm" : "sm"}
        onClick={() => {
          navigate("/ai-assistant");
          if (isMobile) setMobileMenuOpen(false);
        }}
        className="font-medium hover:bg-primary/10 w-full justify-start md:w-auto"
      >
        <MessageSquare className="h-4 w-4 mr-1" /> Asistente IA
      </Button>

      <Button
        variant="ghost"
        size={isMobile ? "sm" : "sm"}
        onClick={() => {
          navigate("/settings");
          if (isMobile) setMobileMenuOpen(false);
        }}
        className="font-medium hover:bg-primary/10 w-full justify-start md:w-auto"
      >
        <Settings className="h-4 w-4 mr-1" /> Configuración
      </Button>
    </>
  );

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center">
            <span
              onClick={() => navigate("/")}
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent cursor-pointer"
            >
              CRM Personal
            </span>
          </div>

          {currentUser && (
            <>
              {/* Desktop navigation */}
              <div className="hidden md:flex items-center space-x-2">
                <NavItems />

                <div className="flex items-center border-l pl-3 ml-2">
                  <div
                    className="flex items-center mr-3 cursor-pointer"
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
                    <span className="text-sm font-medium">
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

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[250px] sm:w-[300px] py-6">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={currentUser.avatar_url || "/default-avatar.png"}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(currentUser.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {currentUser.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <NavItems />
                      </div>
                      
                      <div className="mt-auto pt-4 border-t">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar sesión
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
