
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, MessageSquare } from "lucide-react";
import { useCrm } from "../../context/CrmContext";
import { Contact } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import ContactSelectionDialog from "../contacts/ContactSelectionDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContactItemProps {
  contact: Contact;
  isActive: boolean;
  onClick: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isActive, onClick }) => {
  // Convert date to relative time string (e.g. "2 hours ago")
  const getRelativeTime = (date: Date | undefined) => {
    if (!date) return "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };

  // Get the last activity time display
  const lastActivityTime = contact.lastActivity 
    ? getRelativeTime(contact.lastActivity) 
    : "";

  return (
    <div
      className={`p-3 sm:p-3 border-b cursor-pointer transition-colors ${
        isActive
          ? "bg-gray-100 border-l-4 border-l-primary"
          : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm sm:text-base mr-3">
          {contact.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="font-medium text-sm sm:text-base truncate">{contact.name}</h3>
            {lastActivityTime && (
              <span className="text-xs text-gray-400 ml-2">{lastActivityTime}</span>
            )}
          </div>
          
          <p className="text-xs text-gray-500 truncate mt-1">
            {contact.company || "Sin mensajes recientes"}
          </p>
        </div>
      </div>
    </div>
  );
};

const ContactSidebar = () => {
  const { contacts, setActiveContactId, activeContactId, recentContacts } = useCrm();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  // Filter contacts based on recents and search term
  const displayContacts = (searchTerm ? contacts : recentContacts || [])
    .filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleNewConversation = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className={`border-r bg-white ${isMobile && activeContactId ? 'hidden' : 'flex flex-col w-full md:w-80 lg:w-96'}`}>
      <div className="p-3 sm:p-4 border-b">
        <div className="flex justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Conversaciones</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  onClick={handleNewConversation} 
                  className="h-8 w-8 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Nueva conversación</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-8"
            placeholder="Buscar conversaciones..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {displayContacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center h-full">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
            {searchTerm ? (
              <p>No se encontraron contactos</p>
            ) : (
              <>
                <p>No hay conversaciones recientes</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={handleNewConversation}
                >
                  Iniciar una nueva conversación
                </Button>
              </>
            )}
          </div>
        ) : (
          displayContacts.map(contact => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={contact.id === activeContactId}
              onClick={() => setActiveContactId(contact.id)}
            />
          ))
        )}
      </ScrollArea>

      <ContactSelectionDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default ContactSidebar;
