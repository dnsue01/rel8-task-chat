
import React from "react";
import { useCrm } from "../../context/CrmContext";
import TaskBubble from "../tasks/TaskBubble";
import NewTaskForm from "../tasks/NewTaskForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, Building2, Tag, MessageSquare, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContactDetail: React.FC = () => {
  const { activeContactId, getContactById, getTasksForContact, getNotesForContact } = useCrm();

  if (!activeContactId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Contact Selected</h2>
          <p>Select a contact to view details and tasks</p>
        </div>
      </div>
    );
  }

  const contact = getContactById(activeContactId);
  const tasks = getTasksForContact(activeContactId);
  const notes = getNotesForContact(activeContactId);

  if (!contact) {
    return <div>Contact not found</div>;
  }

  // Get initials from name for avatar fallback
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusBadge = () => {
    switch (contact.status) {
      case "client":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Client</span>;
      case "lead":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Lead</span>;
      case "collaborator":
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">Collaborator</span>;
      case "personal":
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">Personal</span>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Contact Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
              {getStatusBadge()}
            </div>
            <p className="text-gray-500">
              {contact.lastActivity && 
                `Last activity ${formatDistanceToNow(contact.lastActivity, { addSuffix: true })}`}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-1" /> {contact.email}
              </div>
              {contact.phone && (
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-1" /> {contact.phone}
                </div>
              )}
              {contact.company && (
                <div className="flex items-center text-sm text-gray-500">
                  <Building2 className="h-4 w-4 mr-1" /> {contact.company}
                </div>
              )}
            </div>
            {contact.tags && contact.tags.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-500" />
                {contact.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Tasks and Notes */}
      <Tabs defaultValue="tasks" className="flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="flex-1 overflow-auto">
          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => <TaskBubble key={task.id} task={task} />)
            ) : (
              <div className="bg-gray-50 p-6 text-center rounded-lg">
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No tasks yet</p>
              </div>
            )}
          </div>

          {/* New Task Form */}
          <NewTaskForm contactId={activeContactId} />
        </TabsContent>

        <TabsContent value="notes" className="flex-1 overflow-auto">
          {/* Notes List */}
          <div className="space-y-4">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note.id} className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-800">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDistanceToNow(note.createdAt, { addSuffix: true })}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-6 text-center rounded-lg">
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No notes yet</p>
              </div>
            )}
            
            <Button className="mt-4">Add Note</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactDetail;
