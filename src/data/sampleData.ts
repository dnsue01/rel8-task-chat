
import { Contact, Task, Note } from "../types";

// Sample Contacts
export const sampleContacts: Contact[] = [
  {
    id: "c1",
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "555-123-4567",
    company: "TechCorp",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "client",
    lastActivity: new Date("2023-04-09T10:20:00"),
    tags: ["tech", "highvalue"]
  },
  {
    id: "c2",
    name: "Sam Green",
    email: "sam@example.com",
    phone: "555-234-5678",
    company: "DesignHub",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: "collaborator",
    lastActivity: new Date("2023-04-08T14:30:00"),
    tags: ["design", "freelancer"]
  },
  {
    id: "c3",
    name: "Taylor Wilson",
    email: "taylor@example.com",
    phone: "555-345-6789",
    company: "MarketBoost",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "lead",
    lastActivity: new Date("2023-04-07T09:15:00"),
    tags: ["marketing"]
  },
  {
    id: "c4",
    name: "Jordan Lee",
    email: "jordan@example.com",
    phone: "555-456-7890",
    company: "FinanceFirst",
    avatar: "https://i.pravatar.cc/150?img=4",
    status: "client",
    lastActivity: new Date("2023-04-05T16:45:00"),
    tags: ["finance", "highvalue"]
  },
  {
    id: "c5",
    name: "Casey Rodriguez",
    email: "casey@example.com",
    phone: "555-567-8901",
    company: "EduLearn",
    avatar: "https://i.pravatar.cc/150?img=5",
    status: "personal",
    lastActivity: new Date("2023-04-04T11:10:00"),
    tags: ["education"]
  },
];

// Sample Tasks
export const sampleTasks: Task[] = [
  {
    id: "t1",
    contactId: "c1",
    title: "Review proposal draft",
    description: "Check the technical specifications and pricing in the proposal.",
    status: "waiting",
    priority: "high",
    createdAt: new Date("2023-04-07T09:00:00"),
    dueDate: new Date("2023-04-12T17:00:00"),
  },
  {
    id: "t2",
    contactId: "c1",
    title: "Schedule follow-up meeting",
    description: "Discuss project timeline and resource allocation.",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date("2023-04-07T09:30:00"),
    dueDate: new Date("2023-04-10T12:00:00"),
  },
  {
    id: "t3",
    contactId: "c2",
    title: "Review design mockups",
    description: "Provide feedback on website redesign concepts.",
    status: "done",
    priority: "medium",
    createdAt: new Date("2023-04-05T14:00:00"),
    dueDate: new Date("2023-04-07T17:00:00"),
    completedAt: new Date("2023-04-07T15:30:00"),
  },
  {
    id: "t4",
    contactId: "c3",
    title: "Send campaign metrics",
    status: "overdue",
    priority: "high",
    createdAt: new Date("2023-03-30T10:00:00"),
    dueDate: new Date("2023-04-05T17:00:00"),
  },
  {
    id: "t5",
    contactId: "c4",
    title: "Update budget spreadsheet",
    description: "Incorporate Q2 projections.",
    status: "waiting",
    priority: "low",
    createdAt: new Date("2023-04-06T08:30:00"),
    dueDate: new Date("2023-04-15T17:00:00"),
  },
];

// Sample Notes
export const sampleNotes: Note[] = [
  {
    id: "n1",
    contactId: "c1",
    content: "Prefers communication via email. Available best in the mornings.",
    createdAt: new Date("2023-03-20T11:00:00"),
  },
  {
    id: "n2",
    contactId: "c1",
    content: "Interested in expanding contract to include mobile app development in Q3.",
    createdAt: new Date("2023-04-05T14:20:00"),
  },
  {
    id: "n3",
    contactId: "c2",
    content: "Connected on LinkedIn. Has great experience with Figma and Adobe XD.",
    createdAt: new Date("2023-03-15T16:30:00"),
  },
  {
    id: "n4",
    contactId: "c3",
    content: "Initially reached out through Twitter. Looking for comprehensive marketing strategy.",
    createdAt: new Date("2023-04-01T09:45:00"),
  },
];

// Export as a group for convenience
export { sampleContacts as contacts, sampleTasks as tasks, sampleNotes as notes };
