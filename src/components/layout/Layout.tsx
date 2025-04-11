
import React, { useState } from "react";
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
      <Navbar currentUser={currentUser} />

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default Layout;
