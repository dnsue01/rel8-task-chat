
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Calendar, Mail } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile"; // Fixed: Changed useMobile to useIsMobile
import { useCrm } from "../../context/CrmContext";
import { useIntegrations } from "../../context/IntegrationsContext";
import ContactSidebar from "../sidebar/ContactSidebar";

interface LayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideSidebar = false }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { logout, currentUser } = useCrm();
  const { isGoogleConnected } = useIntegrations();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {isMobile && !hideSidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="mr-2"
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </Button>
              )}
              <span className="text-xl font-bold text-primary">CRM Personal</span>
            </div>
            
            {currentUser && (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/app')}
                >
                  Contactos
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/integrations')}
                  className="flex items-center gap-2"
                >
                  <div className="flex gap-1">
                    <Calendar className="h-4 w-4" />
                    <Mail className="h-4 w-4" />
                  </div>
                  Integraciones
                  {isGoogleConnected && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </Button>
                
                <div className="flex items-center border-l pl-4 ml-2">
                  <div className="flex items-center mr-4">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-2">
                      <User size={16} />
                    </div>
                    <span className="text-sm font-medium">{currentUser.name}</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Cerrar sesión"
                  >
                    <LogOut size={18} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {!hideSidebar && (
          <div
            className={`${
              isMobile
                ? `fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
                    menuOpen ? "translate-x-0" : "-translate-x-full"
                  }`
                : "w-64 border-r"
            }`}
          >
            {/* Fixed: Removed the onClose prop since ContactSidebar doesn't accept it */}
            <ContactSidebar />
          </div>
        )}
        <div className={`flex-1 overflow-auto ${!hideSidebar && !isMobile ? "ml-64" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
