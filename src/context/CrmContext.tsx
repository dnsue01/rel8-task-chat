import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { sampleContacts, sampleTasks, sampleNotes } from "../data/sampleData";
import { Contact, Task, Note, User } from "../types";

type CrmContextType = {
  contacts: Contact[];
  tasks: Task[];
  notes: Note[];
  activeContactId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  currentUser: User | null;
  
  setActiveContactId: (id: string) => void;
  addContact: (contact: Omit<Contact, "id" | "lastActivity">) => Promise<void>;
  getContactById: (id: string) => Contact | undefined;
  
  addTask: (task: Omit<Task, "id" | "createdAt" | "completedAt">) => void;
  completeTask: (taskId: string) => void;
  reopenTask: (taskId: string) => void;
  getTasksForContact: (contactId: string) => Task[];
  
  addNote: (note: Omit<Note, "id" | "createdAt">) => Promise<void>;
  getNotesForContact: (contactId: string) => Note[];
  
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
};

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('crm_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsAuthenticated(true);
        loadUserData(user.id);
      } catch (e) {
        console.error("Error parsing user data:", e);
        localStorage.removeItem('crm_user');
      }
    } else {
      setContacts(sampleContacts);
      setTasks(sampleTasks);
      setNotes(sampleNotes);
      setIsLoading(false);
    }
  }, []);

  const loadUserData = (userId: string) => {
    setIsLoading(true);
    
    try {
      const userContacts = localStorage.getItem(`crm_contacts_${userId}`);
      const userTasks = localStorage.getItem(`crm_tasks_${userId}`);
      const userNotes = localStorage.getItem(`crm_notes_${userId}`);
      
      setContacts(userContacts ? JSON.parse(userContacts) : []);
      setTasks(userTasks ? JSON.parse(userTasks) : []);
      setNotes(userNotes ? JSON.parse(userNotes) : []);
    } catch (e) {
      console.error("Error loading user data:", e);
      setContacts(sampleContacts);
      setTasks(sampleTasks);
      setNotes(sampleNotes);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = () => {
    if (!currentUser) return;
    
    localStorage.setItem(`crm_contacts_${currentUser.id}`, JSON.stringify(contacts));
    localStorage.setItem(`crm_tasks_${currentUser.id}`, JSON.stringify(tasks));
    localStorage.setItem(`crm_notes_${currentUser.id}`, JSON.stringify(notes));
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const usersData = localStorage.getItem('crm_users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      
      if (user.password !== password) {
        throw new Error("Contraseña incorrecta");
      }
      
      const { password: _, ...safeUser } = user;
      
      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      localStorage.setItem('crm_user', JSON.stringify(safeUser));
      
      loadUserData(safeUser.id);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const usersData = localStorage.getItem('crm_users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      if (users.some((u: any) => u.email === email)) {
        throw new Error("El email ya está registrado");
      }
      
      const newUser = {
        id: uuidv4(),
        name,
        email,
        password,
        createdAt: new Date()
      };
      
      users.push(newUser);
      localStorage.setItem('crm_users', JSON.stringify(users));
      
      const { password: _, ...safeUser } = newUser;
      
      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      localStorage.setItem('crm_user', JSON.stringify(safeUser));
      
      setContacts([]);
      setTasks([]);
      setNotes([]);
      setIsLoading(false);
      
      saveUserData();
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('crm_user');
    
    setContacts(sampleContacts);
    setTasks(sampleTasks);
    setNotes(sampleNotes);
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading && currentUser) {
      saveUserData();
    }
  }, [contacts, tasks, notes, isAuthenticated, currentUser]);

  const getContactById = (id: string) => {
    return contacts.find(contact => contact.id === id);
  };

  const addContact = async (contact: Omit<Contact, "id" | "lastActivity">) => {
    const newContact: Contact = {
      id: uuidv4(),
      lastActivity: new Date(),
      ...contact
    };
    setContacts([...contacts, newContact]);
    if (contacts.length === 0) {
      setActiveContactId(newContact.id);
    }
  };

  const getTasksForContact = (contactId: string) => {
    return tasks.filter(task => task.contactId === contactId);
  };

  const addTask = (task: Omit<Task, "id" | "createdAt" | "completedAt">) => {
    const newTask: Task = {
      id: uuidv4(),
      createdAt: new Date(),
      completedAt: undefined,
      ...task
    };
    setTasks([...tasks, newTask]);

    setContacts(
      contacts.map(contact => 
        contact.id === task.contactId 
          ? { ...contact, lastActivity: new Date() } 
          : contact
      )
    );
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(
      tasks.map(t => 
        t.id === taskId 
          ? { ...t, status: "completed" as TaskStatus, completedAt: new Date() } 
          : t
      )
    );

    setContacts(
      contacts.map(contact => 
        contact.id === task.contactId 
          ? { ...contact, lastActivity: new Date() } 
          : contact
      )
    );
  };

  const reopenTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(
      tasks.map(t => 
        t.id === taskId 
          ? { ...t, status: "waiting" as TaskStatus, completedAt: undefined } 
          : t
      )
    );

    setContacts(
      contacts.map(contact => 
        contact.id === task.contactId 
          ? { ...contact, lastActivity: new Date() } 
          : contact
      )
    );
  };

  const getNotesForContact = (contactId: string) => {
    return notes.filter(note => note.contactId === contactId);
  };

  const addNote = async (note: Omit<Note, "id" | "createdAt">) => {
    const newNote: Note = {
      id: uuidv4(),
      createdAt: new Date(),
      ...note
    };
    setNotes([...notes, newNote]);

    setContacts(
      contacts.map(contact => 
        contact.id === note.contactId 
          ? { ...contact, lastActivity: new Date() } 
          : contact
      )
    );
  };

  const value: CrmContextType = {
    contacts,
    tasks,
    notes,
    activeContactId,
    isLoading,
    isAuthenticated,
    currentUser,
    setActiveContactId,
    addContact,
    getContactById,
    addTask,
    completeTask,
    reopenTask,
    getTasksForContact,
    addNote,
    getNotesForContact,
    login,
    register,
    logout,
    updateUser: (user: User) => {
      setCurrentUser(user);
      localStorage.setItem('crm_user', JSON.stringify(user));
      // In a real app, you would also update the user in your backend
    }
  };

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (context === undefined) {
    throw new Error("useCrm must be used within a CrmProvider");
  }
  return context;
};
