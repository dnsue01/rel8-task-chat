
import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronRight, ExternalLink, UserPlus } from "lucide-react";
import { Task } from "@/types/integrations";
import { Note } from "@/types/index";
import { useToast } from "@/hooks/use-toast";
import { useCrm } from "@/context/CrmContext";

interface TaskCardProps {
  task: Task;
  notes: Note[];
  onLinkNote: (noteId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, notes, onLinkNote }) => {
  const { contacts } = useCrm();
  const { toast } = useToast();
  const linkedNote = notes.find(n => n.id === task.linkedNoteId);
  const [selectedContact, setSelectedContact] = useState<string | null>(task.contactAssociation?.selected || null);
  
  const handleContactSelect = (contactName: string) => {
    setSelectedContact(contactName);
    
    if (contactName !== "Nuevo contacto") {
      const contactMatch = contacts.find(contact => contact.name === contactName);
      if (contactMatch) {
        // Update the task with the contact association in local storage
        const updatedTasks = JSON.parse(localStorage.getItem('google_tasks') || '[]');
        const taskIndex = updatedTasks.findIndex((t: Task) => t.id === task.id);
        
        if (taskIndex !== -1) {
          updatedTasks[taskIndex].contactAssociation = {
            ...updatedTasks[taskIndex].contactAssociation,
            selected: contactName,
            contactId: contactMatch.id
          };
          localStorage.setItem('google_tasks', JSON.stringify(updatedTasks));
        }
        
        toast({
          title: "Contacto asociado",
          description: `La tarea "${task.title}" ha sido asociada a ${contactName}`,
        });
      }
    }
  };
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.title}</h3>
          {task.notes && (
            <p className="text-sm text-gray-500 mt-1">
              {task.link ? (
                <>
                  {task.notes.replace(task.link, '')}
                  {task.notes.replace(task.link, '').length > 0 && <br />}
                </>
              ) : (
                task.notes
              )}
            </p>
          )}
          {task.link && (
            <a 
              href={task.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center mt-1"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              {task.link.length > 50 ? `${task.link.substring(0, 50)}...` : task.link}
            </a>
          )}
        </div>
        <div className="text-right">
          {task.due && (
            <p className="text-xs text-gray-500">
              Vence: {format(new Date(task.due), 'd MMM, yyyy', { locale: es })}
            </p>
          )}
          <Badge 
            variant={task.completed ? "outline" : "secondary"} 
            className="mt-1"
          >
            {task.completed ? 'Completada' : 'Pendiente'}
          </Badge>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <div className="flex items-center">
          <UserPlus className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-500">Contacto:</span>
        </div>
        <div>
          {selectedContact ? (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
              {selectedContact}
            </Badge>
          ) : task.contactAssociation && task.contactAssociation.options.length > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  Asociar contacto <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-[200px]" align="end">
                <Command>
                  <CommandList>
                    <CommandEmpty>Sin sugerencias</CommandEmpty>
                    <CommandGroup>
                      {task.contactAssociation.options.map((option, i) => (
                        <CommandItem 
                          key={i} 
                          onSelect={() => handleContactSelect(option)}
                          className="cursor-pointer"
                        >
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : (
            <span className="text-sm text-gray-500">Sin contactos disponibles</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
