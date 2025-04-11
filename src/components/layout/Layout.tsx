
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCrm } from "../../context/CrmContext";
import Navbar from "./Navbar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";

interface LayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideSidebar = false }) => {
  const isMobile = useIsMobile();
  const { currentUser } = useCrm();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen h-screen">
      {/* Top Navigation bar */}
      <div className="w-full">
        <Navbar currentUser={currentUser} />
      </div>

      {/* Mobile menu button - only visible on small screens */}
      {isMobile && (
        <div className="px-4 py-2 bg-white border-b">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center"
          >
            <Menu className="h-4 w-4 mr-2" />
            <span>Menú</span>
          </Button>
        </div>
      )}

      {/* Mobile menu */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50 w-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;
