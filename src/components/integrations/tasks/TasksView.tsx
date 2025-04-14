
import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, RefreshCw } from "lucide-react";
import { Task, TaskList } from "@/types/integrations";
import { Note } from "@/types/index";
import TaskCard from "./TaskCard";

interface TasksViewProps {
  tasks: Task[];
  taskLists: TaskList[];
  tasksForSelectedDate: Task[];
  notes: Note[];
  selectedDate: Date;
  syncingTasks: boolean;
  onSyncTasks: () => void;
  onLinkNoteToTask: (noteId: string, taskId: string) => void;
}

const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  taskLists,
  tasksForSelectedDate,
  notes,
  selectedDate,
  syncingTasks,
  onSyncTasks,
  onLinkNoteToTask,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Tareas</CardTitle>
          <CardDescription>
            Tus tareas pendientes de Google Tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckSquare className="mx-auto h-12 w-12 opacity-20 mb-2" />
              <p>No hay tareas disponibles</p>
              <Button
                variant="link"
                onClick={onSyncTasks}
                disabled={syncingTasks}
                className="mt-2"
              >
                <RefreshCw
                  className={`mr-2 h-3 w-3 ${
                    syncingTasks ? "animate-spin" : ""
                  }`}
                />
                Sincronizar tareas
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[450px] pr-4">
              <div className="space-y-4">
                {taskLists.map((taskList) => (
                  <div key={taskList.id} className="mb-6">
                    <h3 className="text-lg font-medium mb-3 border-b pb-1">
                      {taskList.title}
                    </h3>
                    <div className="space-y-3">
                      {tasks
                        .filter((task) => task.listId === taskList.id)
                        .map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            notes={notes}
                            onLinkNote={(noteId) => onLinkNoteToTask(noteId, task.id)}
                          />
                        ))}
                      {tasks.filter((task) => task.listId === taskList.id)
                        .length === 0 && (
                        <div className="text-center py-3 text-gray-500 text-sm">
                          No hay tareas en esta lista
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {taskLists.length === 0 && (
                  <div className="text-center py-3 text-gray-500">
                    No hay listas de tareas disponibles
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tareas para hoy</CardTitle>
            <CardDescription>
              {format(selectedDate, "d MMMM, yyyy", { locale: es })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasksForSelectedDate.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay tareas para hoy
              </p>
            ) : (
              <ScrollArea className="h-[300px] pr-2">
                <div className="space-y-3">
                  {tasksForSelectedDate.map((task) => (
                    <div key={task.id} className="border rounded-lg p-3">
                      <p
                        className={`font-medium ${
                          task.completed
                            ? "line-through text-gray-400"
                            : ""
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.notes && (
                        <p className="text-sm text-gray-500 mt-1">{task.notes}</p>
                      )}
                      <Badge
                        variant={task.completed ? "outline" : "secondary"}
                        className="mt-2"
                      >
                        {task.completed ? "Completada" : "Pendiente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TasksView;
