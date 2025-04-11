
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  User,
  Calendar,
  MessageSquare,
  Settings,
  X
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="p-4">
      <div className="flex justify-end mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="hover:bg-gray-100"
        >
          <X size={20} />
        </Button>
      </div>
      <Button
        variant="ghost"
        className="w-full justify-start mb-2"
        onClick={() => handleNavigation("/")}
      >
        <Home className="mr-2 h-4 w-4" /> Inicio
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start mb-2"
        onClick={() => handleNavigation("/app")}
      >
        <User className="mr-2 h-4 w-4" /> Contactos
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start mb-2"
        onClick={() => handleNavigation("/integrations")}
      >
        <Calendar className="mr-2 h-4 w-4" /> Integraciones
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start mb-2"
        onClick={() => handleNavigation("/ai-assistant")}
      >
        <MessageSquare className="mr-2 h-4 w-4" /> Asistente IA
      </Button>
      <Button
        variant="ghost"
        className="w-full justify-start mb-2"
        onClick={() => handleNavigation("/settings")}
      >
        <Settings className="mr-2 h-4 w-4" /> Configuración
      </Button>
    </div>
  );
};

export default MobileMenu;
