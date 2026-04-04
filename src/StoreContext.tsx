import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Contact, Lead, DashboardStats, User, Department, Comment, Notification, Message } from './types';
import { mockTasks, mockContacts, mockLeads, mockUsers, mockDepartments } from './mockData';

interface StoreContextType {
  tasks: Task[];
  contacts: Contact[];
  leads: Lead[];
  users: User[];
  departments: Department[];
  comments: Comment[];
  notifications: Notification[];
  messages: Message[];
  currentUser: User;
  isLoggedIn: boolean;
  theme: 'light' | 'dark';
  stats: DashboardStats;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  setCurrentUser: (user: User) => void;
  toggleTheme: () => void;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

import { getVisibleTasks, getVisibleLeads } from './constants';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('vertis_tasks');
    return saved ? JSON.parse(saved) : mockTasks;
  });
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('vertis_contacts');
    return saved ? JSON.parse(saved) : mockContacts;
  });
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('vertis_leads');
    return saved ? JSON.parse(saved) : mockLeads;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('vertis_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });
  const [departments] = useState<Department[]>(mockDepartments);
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('vertis_comments');
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('vertis_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('vertis_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedId = localStorage.getItem('vertis_current_user_id');
    const savedUsers = localStorage.getItem('vertis_users');
    const currentUsers = savedUsers ? JSON.parse(savedUsers) : mockUsers;
    return currentUsers.find((u: User) => u.id === savedId) || currentUsers[0];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('vertis_is_logged_in') === 'true';
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('vertis_theme') as 'light' | 'dark') || 'light';
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeLeads: 0,
    completedTasks: 0,
    conversionRate: 0,
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vertis_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('vertis_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('vertis_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('vertis_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('vertis_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('vertis_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('vertis_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('vertis_current_user_id', currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('vertis_is_logged_in', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('vertis_theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const visibleTasks = getVisibleTasks(currentUser, tasks, users);
    const visibleLeads = getVisibleLeads(currentUser, leads);

    const totalRevenue = visibleLeads.reduce((acc, lead) => acc + lead.value, 0);
    const activeLeads = visibleLeads.filter(l => l.status !== 'closed').length;
    const completedTasks = visibleTasks.filter(t => t.status === 'completed').length;
    const closedLeads = visibleLeads.filter(l => l.status === 'closed').length;
    const conversionRate = visibleLeads.length > 0 ? (closedLeads / visibleLeads.length) * 100 : 0;

    setStats({
      totalRevenue,
      activeLeads,
      completedTasks,
      conversionRate,
    });
  }, [tasks, leads, currentUser, users]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = { 
      ...task, 
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now
    };
    setTasks(prev => [newTask, ...prev]);

    // Add notification for the assignee
    if (task.assignedTo !== currentUser.id) {
      addNotification({
        userId: task.assignedTo,
        title: 'New Task Assigned',
        message: `You have been assigned a new task: ${task.title}`,
        type: 'task',
        read: false
      });
    }
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === id ? { 
      ...task, 
      ...updatedFields, 
      updatedAt: new Date().toISOString() 
    } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = { ...contact, id: Math.random().toString(36).substr(2, 9) };
    setContacts(prev => [newContact, ...prev]);
  };

  const updateContact = (id: string, updatedFields: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => contact.id === id ? { ...contact, ...updatedFields } : contact));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead = { ...lead, id: Math.random().toString(36).substr(2, 9) };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id: string, updatedFields: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, ...updatedFields } : lead));
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  const login = (email: string, password?: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      if (password && user.password && user.password !== password) {
        return false;
      }
      setCurrentUser(user);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (id: string, updatedFields: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updatedFields, updatedAt: new Date().toISOString() } : user));
    
    // Update corresponding employee contact if it exists
    setContacts(prev => prev.map(contact => contact.id === `emp-${id}` ? { 
      ...contact, 
      name: updatedFields.name || contact.name,
      email: updatedFields.email || contact.email,
      phone: updatedFields.phone || contact.phone,
      avatarUrl: updatedFields.avatarUrl || contact.avatarUrl,
      role: updatedFields.role || contact.role,
      roleLevel: updatedFields.roleLevel !== undefined ? updatedFields.roleLevel : contact.roleLevel,
      departmentId: updatedFields.departmentId || contact.departmentId,
    } : contact));

    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updatedFields, updatedAt: new Date().toISOString() }));
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);

    // Add notification for task owner/assignee if someone else comments
    const task = tasks.find(t => t.id === comment.taskId);
    if (task && task.assignedTo !== comment.userId) {
      addNotification({
        userId: task.assignedTo,
        title: 'New Comment',
        message: `Someone commented on your task: ${task.title}`,
        type: 'comment',
        read: false
      });
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addMessage = (message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <StoreContext.Provider value={{
      tasks, contacts, leads, users, departments, comments, notifications, messages, currentUser, isLoggedIn, theme, stats,
      addTask, updateTask, deleteTask,
      addContact, updateContact, deleteContact,
      addLead, updateLead, deleteLead,
      addUser, updateUser, deleteUser,
      setCurrentUser, toggleTheme, login, logout, addComment, addNotification, markNotificationAsRead, addMessage
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
