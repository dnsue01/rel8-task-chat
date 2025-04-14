
import React, { useState } from "react";
import { Task } from "../../types";
import { useCrm } from "../../context/CrmContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Calendar, Flag, Pencil, Trash } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale";
import EditTaskForm from "./EditTaskForm";

interface TaskBubbleProps {
  task: Task;
}

const TaskBubble: React.FC<TaskBubbleProps> = ({ task }) => {
  const { updateTask, deleteTask } = useCrm();
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleComplete = async () => {
    try {
      await updateTask({
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? new Date() : undefined,
      });
      toast.success(
        task.completed ? "Tarea marcada como pendiente" : "Tarea completada"
      );
    } catch (error) {
      toast.error("Error al actualizar la tarea");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      toast.success("Tarea eliminada");
    } catch (error) {
      toast.error("Error al eliminar la tarea");
    }
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      {isEditing ? (
        <EditTaskForm task={task} onCancel={() => setIsEditing(false)} />
      ) : (
        <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3
                  className={`font-medium ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </h3>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status badge - show only if completed */}
                  {task.completed && (
                    <span className="bg-green-100 text-green-800 text-xs py-0.5 px-2 rounded-full">
                      Completada
                    </span>
                  )}
                  
                  {/* Priority flag - separate from status */}
                  {task.priority && (
                    <div className="flex items-center">
                      <Flag className={`h-3.5 w-3.5 ${getPriorityColor()}`} />
                      <span className={`text-xs ${getPriorityColor()} ml-1`}>
                        {task.priority === "high" && "Alta"}
                        {task.priority === "medium" && "Media"}
                        {task.priority === "low" && "Baja"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {task.description && (
                <p className="text-gray-600 text-sm mt-1 mb-2">{task.description}</p>
              )}

              <div className="flex items-center gap-3 mt-1 mb-2 flex-wrap">
                {task.dueDate && (
                  <span className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(task.dueDate, "d MMM yyyy", { locale: es })}
                  </span>
                )}

                <span className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(task.createdAt, {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 px-2"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Editar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Eliminar</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskBubble;
