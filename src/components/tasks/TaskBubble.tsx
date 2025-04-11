
import React from "react";
import { Task } from "../../types";
import { formatDistanceToNow, isPast, isToday } from "date-fns";
import { Check, Clock, Calendar, Edit, Trash, AlertCircle } from "lucide-react";
import { useCrm } from "../../context/CrmContext";
import { Button } from "@/components/ui/button";

interface TaskBubbleProps {
  task: Task;
}

const TaskBubble: React.FC<TaskBubbleProps> = ({ task }) => {
  const { completeTask, reopenTask } = useCrm();

  const getBubbleClass = () => {
    switch (task.status) {
      case "pending":
      case "waiting":
        return "task-bubble-waiting";
      case "in-progress":
        return "task-bubble-in-progress";
      case "completed":
      case "done":
        return "task-bubble-done";
      case "cancelled":
      case "overdue":
        return "task-bubble-overdue";
      default:
        return "task-bubble-waiting";
    }
  };

  const getStatusText = () => {
    switch (task.status) {
      case "pending":
      case "waiting":
        return "Waiting";
      case "in-progress":
        return "In Progress";
      case "completed":
      case "done":
        return "Completed";
      case "cancelled":
      case "overdue":
        return "Overdue";
      default:
        return "Unknown";
    }
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case "high":
        return <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">High</span>;
      case "medium":
        return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">Medium</span>;
      case "low":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Low</span>;
      default:
        return null;
    }
  };

  const handleStatusChange = (newStatus: Task["status"]) => {
    if (newStatus === "completed" || newStatus === "done") {
      completeTask(task.id);
    } else {
      reopenTask(task.id);
    }
  };

  const formatTaskDate = (date?: Date) => {
    if (!date) return null;

    if (isToday(date)) {
      return "Today";
    } else if (isPast(date) && task.status !== "completed" && task.status !== "done") {
      return `Overdue: ${formatDistanceToNow(date, { addSuffix: true })}`;
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  return (
    <div className={`task-bubble ${getBubbleClass()}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{task.title}</h3>
        {getPriorityBadge()}
      </div>
      
      {task.description && <p className="text-sm text-gray-600 mb-3">{task.description}</p>}
      
      <div className="flex items-center text-xs text-gray-500 mb-3">
        <Clock size={14} className="mr-1" /> Created {formatDistanceToNow(task.createdAt, { addSuffix: true })}
        
        {task.dueDate && (
          <span className="flex items-center ml-4">
            <Calendar size={14} className="mr-1" /> Due {formatTaskDate(task.dueDate)}
          </span>
        )}

        {task.completedAt && (
          <span className="flex items-center ml-4">
            <Check size={14} className="mr-1" /> Completed {formatDistanceToNow(task.completedAt, { addSuffix: true })}
          </span>
        )}
      </div>
      
      <div className="flex gap-2">
        {(task.status !== "completed" && task.status !== "done") && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={() => handleStatusChange("completed")}
          >
            <Check size={14} className="mr-1" /> Mark Done
          </Button>
        )}
        
        {(task.status === "completed" || task.status === "done") && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={() => handleStatusChange("in-progress")}
          >
            <Clock size={14} className="mr-1" /> Reopen
          </Button>
        )}
        
        {(task.status === "pending" || task.status === "waiting") && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={() => handleStatusChange("in-progress")}
          >
            <Clock size={14} className="mr-1" /> Start
          </Button>
        )}
        
        <Button variant="ghost" size="sm" className="text-xs">
          <Edit size={14} className="mr-1" /> Edit
        </Button>
        
        <Button variant="ghost" size="sm" className="text-xs text-red-500">
          <Trash size={14} className="mr-1" /> Delete
        </Button>
      </div>
      
      <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-white/80 flex items-center">
        <AlertCircle size={12} className="mr-1" /> {getStatusText()}
      </div>
    </div>
  );
};

export default TaskBubble;
