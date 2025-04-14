
import React, { useState } from "react";
import { useCrm } from "../../context/CrmContext";
import { Task } from "../../types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import EditTaskForm from "./EditTaskForm";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskBubbleProps {
  task: Task;
}

const TaskBubble: React.FC<TaskBubbleProps> = ({ task }) => {
  const { updateTask, deleteTask, getContactById } = useCrm();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const contact = task.contactId ? getContactById(task.contactId) : null;

  const handleCompletedChange = (checked: boolean) => {
    updateTask(task.id, {
      ...task,
      completed: checked
    });
  };

  const handleDelete = () => {
    deleteTask(task.id);
    toast({
      title: "Tarea eliminada",
      description: "La tarea ha sido eliminada correctamente."
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
      case "urgent":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200";
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  if (isEditing) {
    return (
      <EditTaskForm 
        task={task} 
        onCancel={() => setIsEditing(false)} 
      />
    );
  }

  return (
    <>
      <div className="border rounded-lg p-3 bg-white shadow-sm">
        <div className="flex items-start gap-2">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={handleCompletedChange} 
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between gap-2">
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {(task.description || task.content) && (
              <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description || task.content}
              </p>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-2">
              <div className="flex items-center">
                <Badge className={`${getPriorityColor(task.priority)}`}>
                  {task.priority === 'high' ? 'Alta' : 
                   task.priority === 'urgent' ? 'Urgente' : 
                   task.priority === 'medium' ? 'Media' : 'Baja'}
                </Badge>
                
                {task.completed && (
                  <Badge variant="outline" className="ml-2 text-gray-500 border-gray-200">
                    Completada
                  </Badge>
                )}
              </div>
              
              {task.dueDate && (
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(task.dueDate, "d 'de' MMMM, yyyy", { locale: es })}
                </div>
              )}
            </div>
            {contact && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  Contacto: {contact.name}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la tarea y no puede deshacerse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskBubble;
