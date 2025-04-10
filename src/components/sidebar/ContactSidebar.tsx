
import React from "react";
import { useCrm } from "../../context/CrmContext";
import { Contact } from "../../types";
import { Plus, Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const ContactSidebar: React.FC = () => {
  const { contacts, activeContactId, setActiveContactId } = useCrm();

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
    if (!date) return "No activity";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  // Sort contacts by last activity, most recent first
  const sortedContacts = [...contacts].sort((a, b) => {
    if (!a.lastActivity) return 1;
    if (!b.lastActivity) return -1;
    return b.lastActivity.getTime() - a.lastActivity.getTime();
  });

  return (
    <div className="w-80 h-full flex flex-col bg-white border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Contacts</h2>
        <p className="text-sm text-gray-500">Manage your relationships</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Search contacts..." 
            className="pl-10"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {sortedContacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact-item ${
              contact.id === activeContactId ? "active" : ""
            }`}
            onClick={() => handleContactClick(contact)}
          >
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
        ))}
      </div>

      {/* Add Contact Button */}
      <div className="p-4 border-t">
        <Button className="w-full flex items-center justify-center gap-2">
          <Plus size={16} /> Add Contact
        </Button>
      </div>
    </div>
  );
};

export default ContactSidebar;
