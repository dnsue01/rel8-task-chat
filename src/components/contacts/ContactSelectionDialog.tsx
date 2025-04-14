
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, UserPlus, User } from "lucide-react";
import { useCrm } from "../../context/CrmContext";
import NewContactForm from "./NewContactForm";
import { Contact } from "@/types";

interface ContactSelectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactSelectionDialog: React.FC<ContactSelectionDialogProps> = ({ isOpen, onOpenChange }) => {
  const { contacts, setActiveContactId, addToRecentContacts } = useCrm();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewContactDialogOpen, setIsNewContactDialogOpen] = useState(false);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleContactSelect = (contact: Contact) => {
    setActiveContactId(contact.id);
    addToRecentContacts(contact.id);
    onOpenChange(false);
    setSearchTerm("");
  };

  const handleNewContactSuccess = () => {
    setIsNewContactDialogOpen(false);
    onOpenChange(false);
    setSearchTerm("");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Iniciar nueva conversación</DialogTitle>
          </DialogHeader>
          
          <div className="relative mb-4 mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              className="pl-8"
              placeholder="Buscar contactos..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mb-4 justify-start" 
            onClick={() => setIsNewContactDialogOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Crear nuevo contacto
          </Button>
          
          <ScrollArea className="max-h-[300px] pr-2">
            {filteredContacts.length > 0 ? (
              <div className="space-y-2">
                {filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center"
                    onClick={() => handleContactSelect(contact)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm mr-3">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium">{contact.name}</h3>
                      {contact.company && <p className="text-xs text-gray-500">{contact.company}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <User className="mx-auto h-8 w-8 opacity-30 mb-2" />
                <p>No se encontraron contactos</p>
                <p className="text-sm mt-1">Crea un nuevo contacto o ajusta tu búsqueda</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <NewContactForm
        isOpen={isNewContactDialogOpen}
        onOpenChange={setIsNewContactDialogOpen}
        onSuccess={handleNewContactSuccess}
      />
    </>
  );
};

export default ContactSelectionDialog;
