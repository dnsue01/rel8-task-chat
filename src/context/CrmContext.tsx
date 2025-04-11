import React, { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { sampleContacts, sampleTasks, sampleNotes } from "../data/sampleData";
import { Contact, Task, Note, User, TaskStatus } from "../types";
import { jwtDecode } from "jwt-decode";

type CrmContextType = {
  contacts: Contact[];
  tasks: Task[];
  notes: Note[];
  activeContactId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  currentUser: User | null;
  
  setActiveContactId: (id: string | null) => void;
  addContact: (contact: Omit<Contact, "id" | "lastActivity">) => Promise<void>;
  updateContact: (id: string, contactData: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addContacts: (contacts: Omit<Contact, "id" | "lastActivity">[]) => Promise<void>;
  getContactById: (id: string) => Contact | undefined;
  
  addTask: (task: Omit<Task, "id" | "createdAt" | "completedAt">) => void;
  updateTask: (task: Task) => void;
  completeTask: (taskId: string) => void;
  reopenTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  getTasksForContact: (contactId: string) => Task[];
  
  addNote: (note: Omit<Note, "id" | "createdAt">) => Promise<void>;
  getNotesForContact: (contactId: string) => Note[];
  
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (googleCredential: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
};

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const parseDates = (obj: any): any => {
  if (!obj) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => parseDates(item));
  }
  
  if (typeof obj === 'object') {
    const newObj = {...obj};
    Object.keys(newObj).forEach(key => {
      if (
        (typeof newObj[key] === 'string' && 
         (key.endsWith('At') || key === 'lastActivity' || key === 'dueDate')) ||
        (key === 'lastActivity' || key === 'createdAt' || key === 'completedAt' || key === 'dueDate')
      ) {
        if (newObj[key]) {
          try {
            newObj[key] = new Date(newObj[key]);
          } catch (e) {
            console.error(`Error parsing date for key ${key}:`, e);
          }
        }
      } else if (typeof newObj[key] === 'object') {
        newObj[key] = parseDates(newObj[key]);
      }
    });
    return newObj;
  }
  
  return obj;
};

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
      setContacts(parseDates(sampleContacts));
      setTasks(parseDates(sampleTasks));
      setNotes(parseDates(sampleNotes));
      setIsLoading(false);
    }
  }, []);

  const loadUserData = (userId: string) => {
    setIsLoading(true);
    
    try {
      const userContacts = localStorage.getItem(`crm_contacts_${userId}`);
      const userTasks = localStorage.getItem(`crm_tasks_${userId}`);
      const userNotes = localStorage.getItem(`crm_notes_${userId}`);
      
      setContacts(userContacts ? parseDates(JSON.parse(userContacts)) : []);
      setTasks(userTasks ? parseDates(JSON.parse(userTasks)) : []);
      setNotes(userNotes ? parseDates(JSON.parse(userNotes)) : []);
    } catch (e) {
      console.error("Error loading user data:", e);
      setContacts(parseDates(sampleContacts));
      setTasks(parseDates(sampleTasks));
      setNotes(parseDates(sampleNotes));
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

  const loginWithGoogle = async (googleCredential: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const decodedToken: any = jwtDecode(googleCredential);
      
      if (!decodedToken.email) {
        throw new Error("No se pudo obtener el email del usuario");
      }
      
      const usersData = localStorage.getItem('crm_users');
      const users = usersData ? JSON.parse(usersData) : [];
      
      let user = users.find((u: any) => u.email === decodedToken.email);
      
      if (!user) {
        const newUser = {
          id: uuidv4(),
          name: decodedToken.name || "Usuario de Google",
          email: decodedToken.email,
          password: uuidv4(),
          avatar_url: decodedToken.picture,
          createdAt: new Date(),
          googleId: decodedToken.sub
        };
        
        users.push(newUser);
        localStorage.setItem('crm_users', JSON.stringify(users));
        
        const { password: _, ...safeUser } = newUser;
        user = safeUser;
      } else {
        if (!user.googleId || !user.avatar_url) {
          user.googleId = decodedToken.sub;
          user.avatar_url = user.avatar_url || decodedToken.picture;
          
          const updatedUsers = users.map((u: any) => 
            u.id === user.id ? {...u, googleId: decodedToken.sub, avatar_url: user.avatar_url || decodedToken.picture} : u
          );
          
          localStorage.setItem('crm_users', JSON.stringify(updatedUsers));
        }
        
        const { password: _, ...safeUser } = user;
        user = safeUser;
      }
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('crm_user', JSON.stringify(user));
      
      loadUserData(user.id);
    } catch (error) {
      setIsLoading(false);
      console.error("Error in loginWithGoogle:", error);
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
        avatar_url: null,
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

  const updateUser = (user: User) => {
    if (!user) return;
    
    setCurrentUser(user);
    localStorage.setItem('crm_user', JSON.stringify(user));
    
    const usersData = localStorage.getItem('crm_users');
    if (usersData) {
      try {
        const users = JSON.parse(usersData);
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? { ...u, name: user.name, email: user.email, avatar_url: user.avatar_url } : u
        );
        localStorage.setItem('crm_users', JSON.stringify(updatedUsers));
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading && currentUser) {
      saveUserData();
    }
  }, [contacts, tasks, notes, isAuthenticated, currentUser]);

  const updateContact = (id: string, contactData: Partial<Contact>) => {
    setContacts(prevContacts => 
      prevContacts.map(contact => 
        contact.id === id 
          ? { ...contact, ...contactData, lastActivity: new Date() }
          : contact
      )
    );
  };

  const deleteContact = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.contactId !== id));
    
    setNotes(prevNotes => prevNotes.filter(note => note.contactId !== id));
    
    setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
    
    if (activeContactId === id) {
      setActiveContactId(null);
    }
  };

  const getContactById = (id: string) => {
    return contacts.find(contact => contact.id === id);
  };

  const addContact = async (contact: Omit<Contact, "id" | "lastActivity">) => {
    const newContact: Contact = {
      id: uuidv4(),
      lastActivity: new Date(),
      ...contact
    };
    setContacts(prevContacts => [...prevContacts, newContact]);
    if (contacts.length === 0) {
      setActiveContactId(newContact.id);
    }
    return Promise.resolve();
  };

  const addContacts = async (contactsToAdd: Omit<Contact, "id" | "lastActivity">[]) => {
    const newContacts = contactsToAdd.map(contact => ({
      id: uuidv4(),
      lastActivity: new Date(),
      ...contact
    }));
    
    setContacts(prevContacts => [...prevContacts, ...newContacts]);
    
    if (contacts.length === 0 && newContacts.length > 0) {
      setActiveContactId(newContacts[0].id);
    }
    
    return Promise.resolve();
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

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    
    setContacts(
      contacts.map(contact => 
        contact.id === updatedTask.contactId 
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

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setTasks(tasks.filter(task => task.id !== taskId));
    
    if (task.contactId) {
      setContacts(
        contacts.map(contact => 
          contact.id === task.contactId 
            ? { ...contact, lastActivity: new Date() } 
            : contact
        )
      );
    }
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
    updateContact,
    deleteContact,
    addContacts,
    getContactById,
    addTask,
    updateTask,
    completeTask,
    reopenTask,
    deleteTask,
    getTasksForContact,
    addNote,
    getNotesForContact,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser
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
