
import React from "react";
import { useCrm } from "../../context/CrmContext";
import TaskBubble from "../tasks/TaskBubble";
import NewTaskForm from "../tasks/NewTaskForm";
import AddNoteForm from "./AddNoteForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, Building2, Tag, MessageSquare, FileText, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ContactDetail: React.FC = () => {
  const { activeContactId, getContactById, getTasksForContact, getNotesForContact, isLoading } = useCrm();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 mb-4 animate-spin" />
          <h2 className="text-xl font-semibold mb-2">Cargando datos</h2>
          <p>Por favor espera un momento...</p>
        </div>
      </div>
    );
  }

  if (!activeContactId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Ningún Contacto Seleccionado</h2>
          <p>Selecciona un contacto para ver detalles y tareas</p>
        </div>
      </div>
    );
  }

  const contact = getContactById(activeContactId);
  const tasks = getTasksForContact(activeContactId);
  const notes = getNotesForContact(activeContactId);

  if (!contact) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Contacto no encontrado</h2>
          <p>El contacto solicitado no existe o ha sido eliminado</p>
        </div>
      </div>
    );
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
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Cliente</span>;
      case "lead":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Lead</span>;
      case "collaborator":
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">Colaborador</span>;
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
                `Última actividad ${formatDistanceToNow(contact.lastActivity, { addSuffix: true, locale: es })}`}
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
          <TabsTrigger value="tasks">Tareas</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="flex-1 overflow-auto">
          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => <TaskBubble key={task.id} task={task} />)
            ) : (
              <div className="bg-gray-50 p-6 text-center rounded-lg">
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No hay tareas todavía</p>
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
                    {formatDistanceToNow(note.createdAt, { addSuffix: true, locale: es })}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-6 text-center rounded-lg">
                <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-500">No hay notas todavía</p>
              </div>
            )}
            
            <AddNoteForm contactId={activeContactId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactDetail;
