
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCrm } from "../../context/CrmContext";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";

interface LayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideSidebar = false }) => {
  const isMobile = useIsMobile();
  const { currentUser } = useCrm();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation bar */}
      <div className="flex items-center">
        {isMobile && !hideSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen(!menuOpen)}
            className="mr-2 ml-4 mt-3"
          >
            <Menu size={20} />
          </Button>
        )}
        <div className="w-full">
          <Navbar currentUser={currentUser} />
        </div>
      </div>

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
            } bg-white shadow-md`}
          >
            {isMobile && menuOpen && (
              <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            )}
          </div>
        )}
        <div
          className={`flex-1 overflow-auto ${
            !hideSidebar && !isMobile ? "ml-64" : ""
          } bg-gray-50`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
