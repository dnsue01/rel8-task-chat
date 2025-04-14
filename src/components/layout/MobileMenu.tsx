
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  User,
  Calendar,
  MessageSquare,
  Settings,
  X,
  LogOut,
  CheckCircle2
} from "lucide-react";
import { useCrm } from "../../context/CrmContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIntegrations } from "../../context/IntegrationsContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useCrm();
  const { isGoogleConnected } = useIntegrations();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-[250px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-bold text-lg">Menú</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              <X size={18} />
            </Button>
          </div>
          
          <div className="p-3 flex flex-col gap-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigation("/app")}
            >
              <User className="mr-2 h-4 w-4" /> Contactos
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start truncate"
              onClick={() => handleNavigation("/integrations")}
            >
              <div className="flex mr-2">
                <Calendar className="h-4 w-4" />
                {isGoogleConnected ? (
                  <div className="h-2 w-2 bg-green-500 rounded-full absolute ml-3 mt-3"></div>
                ) : (
                  <div className="h-2 w-2 bg-red-500 rounded-full absolute ml-3 mt-3"></div>
                )}
              </div>
              <span className="truncate">Integraciones</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigation("/tasks")}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Tareas
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigation("/ai-assistant")}
            >
              <MessageSquare className="mr-2 h-4 w-4" /> Asistente IA
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => handleNavigation("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" /> Configuración
            </Button>
          </div>
          
          <div className="mt-auto p-3 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
