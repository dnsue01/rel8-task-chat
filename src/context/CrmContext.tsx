import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Contact, Task, TaskStatus, TaskPriority, Note } from '../types';
import { supabase } from '../integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface CrmContextType {
  contacts: Contact[];
  tasks: Task[];
  notes: Note[];
  activeContactId: string | null;
  setActiveContactId: (id: string | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  getContactById: (contactId: string) => Contact | undefined;
  getTasksForContact: (contactId: string) => Task[];
  getNotesForContact: (contactId: string) => Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'lastActivity'>) => Promise<void>;
  isLoading: boolean;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm must be used within a CrmProvider');
  }
  return context;
};

interface CrmProviderProps {
  children: ReactNode;
}

export const CrmProvider = ({ children }: CrmProviderProps) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);

        const { data: contactsData, error: contactsError } = await supabase
          .from('contacts')
          .select('*')
          .order('last_activity', { ascending: false });

        if (contactsError) throw contactsError;

        const formattedContacts = contactsData.map(contact => ({
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone || undefined,
          company: contact.company || undefined,
          avatar: contact.avatar_url || undefined,
          status: contact.status as Contact['status'],
          lastActivity: contact.last_activity ? new Date(contact.last_activity) : undefined,
          tags: contact.tags || []
        }));

        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (tasksError) throw tasksError;

        const formattedTasks = tasksData.map(task => ({
          id: task.id,
          contactId: task.contact_id,
          title: task.title,
          description: task.description || undefined,
          status: task.status as TaskStatus,
          priority: task.priority as TaskPriority,
          createdAt: new Date(task.created_at),
          dueDate: task.due_date ? new Date(task.due_date) : undefined,
          completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
        }));

        const { data: notesData, error: notesError } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false });

        if (notesError) throw notesError;

        const formattedNotes = notesData.map(note => ({
          id: note.id,
          contactId: note.contact_id,
          content: note.content,
          createdAt: new Date(note.created_at),
        }));

        setContacts(formattedContacts);
        setTasks(formattedTasks);
        setNotes(formattedNotes);

        if (formattedContacts.length > 0 && !activeContactId) {
          setActiveContactId(formattedContacts[0].id);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Inténtalo de nuevo.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const getContactById = (contactId: string) => {
    return contacts.find(contact => contact.id === contactId);
  };

  const getTasksForContact = (contactId: string) => {
    return tasks
      .filter(task => task.contactId === contactId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  const getNotesForContact = (contactId: string) => {
    return notes
      .filter(note => note.contactId === contactId)
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const newTaskData = {
        contact_id: task.contactId,
        title: task.title,
        description: task.description || null,
        status: task.status,
        priority: task.priority,
        due_date: task.dueDate ? task.dueDate.toISOString() : null,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(newTaskData)
        .select()
        .single();

      if (error) throw error;

      const newTask: Task = {
        id: data.id,
        contactId: data.contact_id,
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        createdAt: new Date(data.created_at),
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
      };

      setTasks([newTask, ...tasks]);
    
      const now = new Date();
      await supabase
        .from('contacts')
        .update({ last_activity: now.toISOString() })
        .eq('id', task.contactId);

      setContacts(contacts.map(contact => 
        contact.id === task.contactId 
          ? { ...contact, lastActivity: now }
          : contact
      ));

      toast({
        title: "Tarea creada",
        description: "La tarea se ha añadido con éxito",
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la tarea. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const updatedData: Record<string, any> = { status };
      
      if (status === 'done') {
        updatedData.completed_at = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('tasks')
        .update(updatedData)
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId
          ? { 
              ...task, 
              status,
              completedAt: status === 'done' ? new Date() : task.completedAt 
            }
          : task
      ));

      toast({
        title: "Tarea actualizada",
        description: `La tarea se ha ${status === 'done' ? 'completado' : 'actualizado'} con éxito`,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la tarea. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const addNote = async (note: Omit<Note, 'id' | 'createdAt'>) => {
    try {
      const newNoteData = {
        contact_id: note.contactId,
        content: note.content,
      };

      const { data, error } = await supabase
        .from('notes')
        .insert(newNoteData)
        .select()
        .single();

      if (error) throw error;

      const newNote: Note = {
        id: data.id,
        contactId: data.contact_id,
        content: data.content,
        createdAt: new Date(data.created_at)
      };

      setNotes([newNote, ...notes]);

      const now = new Date();
      await supabase
        .from('contacts')
        .update({ last_activity: now.toISOString() })
        .eq('id', note.contactId);

      setContacts(contacts.map(contact => 
        contact.id === note.contactId 
          ? { ...contact, lastActivity: now }
          : contact
      ));

      toast({
        title: "Nota añadida",
        description: "La nota se ha guardado con éxito",
      });
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la nota. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };
  
  const addContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'lastActivity'>) => {
    try {
      const newContactData = {
        name: contact.name,
        email: contact.email,
        phone: contact.phone || null,
        company: contact.company || null,
        avatar_url: contact.avatar || null,
        status: contact.status,
        tags: contact.tags || [],
      };

      const { data, error } = await supabase
        .from('contacts')
        .insert(newContactData)
        .select()
        .single();

      if (error) throw error;

      const newContact: Contact = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        company: data.company || undefined,
        avatar: data.avatar_url || undefined,
        status: data.status,
        lastActivity: data.last_activity ? new Date(data.last_activity) : new Date(),
        tags: data.tags || []
      };

      setContacts([newContact, ...contacts]);
      setActiveContactId(newContact.id);

      toast({
        title: "Contacto creado",
        description: "El contacto se ha añadido con éxito",
      });
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el contacto. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  return (
    <CrmContext.Provider value={{
      contacts,
      tasks,
      notes,
      activeContactId,
      setActiveContactId,
      addTask,
      updateTaskStatus,
      getContactById,
      getTasksForContact,
      getNotesForContact,
      addNote,
      addContact,
      isLoading
    }}>
      {children}
    </CrmContext.Provider>
  );
};
