
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import { useIntegrations } from "../context/IntegrationsContext";
import { useCrm } from "../context/CrmContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Mail, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import our new components
import ConnectionStatusCard from "@/components/integrations/ConnectionStatusCard";
import ConnectionBenefitsCard from "@/components/integrations/ConnectionBenefitsCard";
import CalendarView from "@/components/integrations/calendar/CalendarView";
import TasksView from "@/components/integrations/tasks/TasksView";
import EmailsView from "@/components/integrations/emails/EmailsView";

const IntegrationsPage: React.FC = () => {
  const {
    isGoogleConnected,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    calendarEvents,
    emails,
    tasks,
    taskLists,
    syncState,
    syncCalendarEvents,
    syncEmails,
    syncTasks,
    getEventsForDate,
    getEmailsForDate,
    linkNoteToEvent,
    linkEmailToNote,
    linkNoteToTask,
    findMatchesForNote,
    findMatchesForEmail,
  } = useIntegrations();

  const { notes, contacts } = useCrm();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTab, setSelectedTab] = useState<string>("calendar");
  const [syncingCalendar, setSyncingCalendar] = useState<boolean>(false);
  const [syncingEmail, setSyncingEmail] = useState<boolean>(false);
  const [syncingTasks, setSyncingTasks] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSyncCalendar = async () => {
    setSyncingCalendar(true);
    try {
      await syncCalendarEvents();
    } finally {
      setSyncingCalendar(false);
    }
  };

  const handleSyncEmail = async () => {
    setSyncingEmail(true);
    try {
      await syncEmails();
    } finally {
      setSyncingEmail(false);
    }
  };

  const handleSyncTasks = async () => {
    setSyncingTasks(true);
    try {
      await syncTasks();
    } finally {
      setSyncingTasks(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await connectGoogleCalendar();
    } finally {
      setConnecting(false);
    }
  };

  const eventsForSelectedDate = getEventsForDate(selectedDate);
  const emailsForSelectedDate = getEmailsForDate(selectedDate);
  const tasksForSelectedDate = tasks.filter((task) => {
    if (!task.due) return false;
    const taskDate = new Date(task.due);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Integraciones</h1>
        <p className="text-gray-500 mb-6">
          Conecta tus servicios de Google para sincronizar tu información
        </p>

        {/* Connection Status Card */}
        <ConnectionStatusCard
          isGoogleConnected={isGoogleConnected}
          syncState={syncState}
          connecting={connecting}
          syncingCalendar={syncingCalendar}
          syncingTasks={syncingTasks}
          syncingEmail={syncingEmail}
          onConnect={handleConnect}
          onDisconnect={disconnectGoogleCalendar}
          onSyncCalendar={handleSyncCalendar}
          onSyncTasks={handleSyncTasks}
          onSyncEmail={handleSyncEmail}
        />

        {/* Benefits Card (shown when not connected) */}
        {!isGoogleConnected && (
          <ConnectionBenefitsCard
            connecting={connecting}
            onConnect={handleConnect}
          />
        )}

        {/* Tabs for connected features */}
        {isGoogleConnected ? (
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="space-y-4"
          >
            <TabsList className="mb-6">
              <TabsTrigger
                value="calendar"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" /> Calendario
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" /> Tareas
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Correo
              </TabsTrigger>
            </TabsList>

            {/* Calendar Tab */}
            <TabsContent value="calendar" className="space-y-4">
              <CalendarView
                eventsForSelectedDate={eventsForSelectedDate}
                notes={notes}
                calendarEvents={calendarEvents}
                selectedDate={selectedDate}
                syncingCalendar={syncingCalendar}
                onSyncCalendar={handleSyncCalendar}
                onLinkNoteToEvent={linkNoteToEvent}
                findMatchesForNote={findMatchesForNote}
              />
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-4">
              <TasksView 
                tasks={tasks}
                taskLists={taskLists}
                tasksForSelectedDate={tasksForSelectedDate}
                notes={notes}
                selectedDate={selectedDate}
                syncingTasks={syncingTasks}
                onSyncTasks={handleSyncTasks}
                onLinkNoteToTask={linkNoteToTask}
              />
            </TabsContent>

            {/* Email Tab */}
            <TabsContent value="email" className="space-y-4">
              <EmailsView
                emails={emails}
                emailsForSelectedDate={emailsForSelectedDate}
                notes={notes}
                calendarEvents={calendarEvents}
                selectedDate={selectedDate}
                syncingEmail={syncingEmail}
                onSyncEmail={handleSyncEmail}
                onLinkEmailToNote={linkEmailToNote}
                findMatchesForEmail={findMatchesForEmail}
              />
            </TabsContent>
          </Tabs>
        ) : null}
      </div>
    </Layout>
  );
};

export default IntegrationsPage;
