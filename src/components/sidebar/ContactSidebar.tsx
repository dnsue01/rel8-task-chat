
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCrm } from "../../context/CrmContext";
import { Contact } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import NewContactForm from "../contacts/NewContactForm";

interface ContactItemProps {
  contact: Contact;
  isActive: boolean;
  onClick: () => void;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact, isActive, onClick }) => {
  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "lead":
        return "bg-yellow-400";
      case "customer":
        return "bg-green-400";
      case "opportunity":
        return "bg-purple-400";
      default:
        return "bg-gray-400";
    }
  };

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
        {/* Avatar placeholder with first letter */}
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm sm:text-base mr-3">
          {contact.name.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm sm:text-base truncate">{contact.name}</h3>
          <div className="flex items-center mt-1">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor(contact.status)}`}></span>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {contact.company || "No company"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactSidebar = () => {
  const { contacts, setActiveContactId, activeContactId, addContact } = useCrm();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewContactDialogOpen, setIsNewContactDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBackToList = () => {
    setActiveContactId(null);
  };

  const handleNewContactSuccess = () => {
    setIsNewContactDialogOpen(false);
  };

  return (
    <div className={`border-r bg-white ${isMobile && activeContactId ? 'hidden' : 'flex flex-col w-full md:w-80 lg:w-96'}`}>
      {/* Back button for mobile */}
      {isMobile && activeContactId && (
        <Button 
          variant="ghost" 
          onClick={handleBackToList}
          className="flex items-center mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to list
        </Button>
      )}

      <div className="p-3 sm:p-4 border-b">
        <div className="flex justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Contactos</h2>
          <Dialog open={isNewContactDialogOpen} onOpenChange={setIsNewContactDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nuevo Contacto</DialogTitle>
                <DialogDescription>
                  Crea un nuevo contacto para tu CRM.
                </DialogDescription>
              </DialogHeader>
              <NewContactForm onSuccess={handleNewContactSuccess} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            className="pl-8"
            placeholder="Buscar contactos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {filteredContacts.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No se encontraron contactos
          </div>
        ) : (
          filteredContacts.map(contact => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isActive={contact.id === activeContactId}
              onClick={() => setActiveContactId(contact.id)}
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default ContactSidebar;
