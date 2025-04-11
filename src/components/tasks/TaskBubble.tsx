
import React, { useState } from "react";
import { Task } from "../../types";
import { formatDistanceToNow, isPast, isToday } from "date-fns";
import { Check, Clock, Calendar, Edit, Trash, AlertCircle } from "lucide-react";
import { useCrm } from "../../context/CrmContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditTaskForm from "./EditTaskForm";
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
import { toast } from "@/components/ui/use-toast";

interface TaskBubbleProps {
  task: Task;
}

const TaskBubble: React.FC<TaskBubbleProps> = ({ task }) => {
  const { completeTask, reopenTask, deleteTask } = useCrm();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
      toast({
        title: "Task completed",
        description: "The task has been marked as completed.",
      });
    } else {
      reopenTask(task.id);
      toast({
        title: "Task reopened",
        description: "The task has been reopened.",
      });
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDeleteDialog(false);
    toast({
      title: "Task deleted",
      description: "The task has been permanently deleted.",
      variant: "destructive",
    });
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
    <>
      <div className={`task-bubble ${getBubbleClass()}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{task.title}</h3>
          {getPriorityBadge()}
        </div>
        
        {task.description && <p className="text-sm text-gray-600 mb-3">{task.description}</p>}
        
        <div className="flex flex-wrap items-center text-xs text-gray-500 mb-3 gap-2">
          <span className="flex items-center">
            <Clock size={14} className="mr-1" /> Created {formatDistanceToNow(task.createdAt, { addSuffix: true })}
          </span>
          
          {task.dueDate && (
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" /> Due {formatTaskDate(task.dueDate)}
            </span>
          )}

          {task.completedAt && (
            <span className="flex items-center">
              <Check size={14} className="mr-1" /> Completed {formatDistanceToNow(task.completedAt, { addSuffix: true })}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
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
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit size={14} className="mr-1" /> Edit
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-red-500"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash size={14} className="mr-1" /> Delete
          </Button>
        </div>
        
        <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-white/80 flex items-center">
          <AlertCircle size={12} className="mr-1" /> {getStatusText()}
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <EditTaskForm task={task} onClose={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{task.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskBubble;
