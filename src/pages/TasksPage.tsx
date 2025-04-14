
import React from "react";
import Layout from "../components/layout/Layout";
import { useCrm } from "../context/CrmContext";
import { Button } from "@/components/ui/button";
import { Plus, CheckSquare, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskBubble from "../components/tasks/TaskBubble";
import NewTaskForm from "../components/tasks/NewTaskForm";

const TasksPage: React.FC = () => {
  const { tasks, isLoading } = useCrm();
  const [showNewTaskForm, setShowNewTaskForm] = React.useState(false);

  // Filter tasks by status
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Tareas</h1>
            <p className="text-gray-500">Gestiona todas tus tareas desde un solo lugar</p>
          </div>
          <Button onClick={() => setShowNewTaskForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> Nueva Tarea
          </Button>
        </div>

        <Tabs defaultValue="pending" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="pending" className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" /> 
                Pendientes ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completadas ({completedTasks.length})
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filtrar
            </Button>
          </div>

          <TabsContent value="pending" className="space-y-4">
            {showNewTaskForm && (
              <div className="mb-4">
                <NewTaskForm onSuccess={() => setShowNewTaskForm(false)} />
              </div>
            )}

            {pendingTasks.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium mb-1">No hay tareas pendientes</h3>
                <p className="text-gray-500 mb-3">¡Buen trabajo! Has completado todas tus tareas.</p>
                <Button onClick={() => setShowNewTaskForm(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Crear nueva tarea
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingTasks.map(task => (
                  <TaskBubble key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg">
                <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium">No hay tareas completadas</h3>
                <p className="text-gray-500">Las tareas que completes aparecerán aquí.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedTasks.map(task => (
                  <TaskBubble key={task.id} task={task} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TasksPage;
