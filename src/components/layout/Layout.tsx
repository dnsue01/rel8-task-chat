
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCrm } from "../../context/CrmContext";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideSidebar = false }) => {
  const isMobile = useIsMobile();
  const { currentUser } = useCrm();

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation bar */}
      <div className="w-full">
        <Navbar currentUser={currentUser} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default Layout;
