
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Contact, Task, TaskStatus, Note } from '../types';
import { sampleContacts, sampleTasks, sampleNotes } from '../data/sampleData';

interface CrmContextType {
  contacts: Contact[];
  tasks: Task[];
  notes: Note[];
  activeContactId: string | null;
  setActiveContactId: (id: string | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  getContactById: (contactId: string) => Contact | undefined;
  getTasksForContact: (contactId: string) => Task[];
  getNotesForContact: (contactId: string) => Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
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
  const [contacts, setContacts] = useState<Contact[]>(sampleContacts);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);

  const getContactById = (contactId: string) => {
    return contacts.find(contact => contact.id === contactId);
  };

  const getTasksForContact = (contactId: string) => {
    return tasks.filter(task => task.contactId === contactId)
      .sort((a, b) => {
        // Sort by creation date, newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  const getNotesForContact = (contactId: string) => {
    return notes.filter(note => note.contactId === contactId)
      .sort((a, b) => {
        // Sort by creation date, newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `t${tasks.length + 1}`,
      createdAt: new Date()
    };
    setTasks([newTask, ...tasks]);
    
    // Update the contact's last activity time
    setContacts(contacts.map(contact => 
      contact.id === task.contactId 
        ? { ...contact, lastActivity: new Date() }
        : contact
    ));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId
        ? { 
            ...task, 
            status,
            completedAt: status === 'done' ? new Date() : task.completedAt 
          }
        : task
    ));
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: `n${notes.length + 1}`,
      createdAt: new Date()
    };
    setNotes([newNote, ...notes]);
    
    // Update the contact's last activity time
    setContacts(contacts.map(contact => 
      contact.id === note.contactId 
        ? { ...contact, lastActivity: new Date() }
        : contact
    ));
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
      addNote
    }}>
      {children}
    </CrmContext.Provider>
  );
};
