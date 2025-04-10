
import React, { useState } from "react";
import { useCrm } from "../../context/CrmContext";
import { Contact } from "../../types";
import { Plus, Search, UserCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import NewContactForm from "../contacts/NewContactForm";
import { es } from "date-fns/locale/es";

const ContactSidebar: React.FC = () => {
  const { contacts, activeContactId, setActiveContactId } = useCrm();
  const [searchQuery, setSearchQuery] = useState("");

  // Get initials from name for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleContactClick = (contact: Contact) => {
    setActiveContactId(contact.id);
  };

  const formatLastActivity = (date?: Date) => {
    if (!date) return "Sin actividad";
    return formatDistanceToNow(date, { addSuffix: true, locale: es });
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (contact.company && contact.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort contacts by last activity, most recent first
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (!a.lastActivity) return 1;
    if (!b.lastActivity) return -1;
    return b.lastActivity.getTime() - a.lastActivity.getTime();
  });

  return (
    <div className="w-80 h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Contactos</h2>
        <p className="text-sm text-gray-500">Gestiona tus relaciones</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Buscar contactos..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {sortedContacts.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            {contacts.length === 0 ? (
              <div>
                <UserCircle className="mx-auto h-10 w-10 opacity-20 mb-2" />
                <p className="text-sm">No hay contactos todavía</p>
                <p className="text-xs mt-1">Añade tu primer contacto para comenzar</p>
              </div>
            ) : (
              <p className="text-sm">No se encontraron contactos que coincidan con "{searchQuery}"</p>
            )}
          </div>
        )}

        {sortedContacts.map((contact) => (
          <div
            key={contact.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
              contact.id === activeContactId ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
            }`}
            onClick={() => handleContactClick(contact)}
          >
            <div className="flex">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                    {formatLastActivity(contact.lastActivity)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{contact.company || contact.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Contact Button */}
      <div className="p-4 border-t">
        <NewContactForm />
      </div>
    </div>
  );
};

export default ContactSidebar;
