
import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { sampleContacts, sampleTasks, sampleNotes } from "../data/sampleData";
import { Contact, Task, Note, TaskStatus, TaskPriority, ContactStatus } from "../types";

type CrmContextType = {
  contacts: Contact[];
  tasks: Task[];
  notes: Note[];
  activeContactId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  currentUser: { id: string; name: string; email: string } | null;
  
  // Contact actions
  setActiveContactId: (id: string) => void;
  addContact: (contact: Omit<Contact, "id" | "lastActivity">) => Promise<void>;
  getContactById: (id: string) => Contact | undefined;
  
  // Task actions
  addTask: (task: Omit<Task, "id" | "createdAt" | "completedAt">) => void;
  completeTask: (taskId: string) => void;
  reopenTask: (taskId: string) => void;
  getTasksForContact: (contactId: string) => Task[];
  
  // Note actions
  addNote: (note: Omit<Note, "id" | "createdAt">) => Promise<void>;
  getNotesForContact: (contactId: string) => Note[];
  
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
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
      // Load sample data for demo if not logged in
      setContacts(sampleContacts);
      setTasks(sampleTasks);
      setNotes(sampleNotes);
      setIsLoading(false);
    }
  }, []);

  // Load user data from localStorage
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
      // Fallback to sample data
      setContacts(sample.contacts);
      setTasks(sample.tasks);
      setNotes(sample.notes);
    } finally {
      setIsLoading(false);
    }
  };

  // Save user data to localStorage
  const saveUserData = () => {
    if (!currentUser) return;
    
    localStorage.setItem(`crm_contacts_${currentUser.id}`, JSON.stringify(contacts));
    localStorage.setItem(`crm_tasks_${currentUser.id}`, JSON.stringify(tasks));
    localStorage.setItem(`crm_notes_${currentUser.id}`, JSON.stringify(notes));
  };

  // Auth functions
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // This is a mock login for demonstration purposes
    // In a real app, this would validate against a backend
    try {
      // Check if user exists in localStorage
      const usersData = localStorage.getItem('crm_users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      
      if (user.password !== password) {
        throw new Error("Contraseña incorrecta");
      }
      
      // Remove password from user data before storing in state
      const { password: _, ...safeUser } = user;
      
      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      localStorage.setItem('crm_user', JSON.stringify(safeUser));
      
      // Load user data
      loadUserData(safeUser.id);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Get existing users or create empty array
      const usersData = localStorage.getItem('crm_users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        throw new Error("El email ya está registrado");
      }
      
      // Create new user
      const newUser = {
        id: uuidv4(),
        name,
        email,
        password, // In a real app, this would be hashed
        createdAt: new Date()
      };
      
      // Add to users and save
      users.push(newUser);
      localStorage.setItem('crm_users', JSON.stringify(users));
      
      // Remove password from user data before storing in state
      const { password: _, ...safeUser } = newUser;
      
      // Set as logged in
      setCurrentUser(safeUser);
      setIsAuthenticated(true);
      localStorage.setItem('crm_user', JSON.stringify(safeUser));
      
      // Initialize empty data for new user
      setContacts([]);
      setTasks([]);
      setNotes([]);
      setIsLoading(false);
      
      // Save empty initial data
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
    
    // Reload sample data for demo
    setContacts(sample.contacts);
    setTasks(sample.tasks);
    setNotes(sample.notes);
  };

  // Save data when it changes and user is authenticated
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

    // Update contact's last activity
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

    // Update contact's last activity
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

    // Update contact's last activity
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

    // Update contact's last activity
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
    logout
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
