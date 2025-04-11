// Mantenemos los tipos existentes y agregamos el campo avatar_url a User
export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string; // Añadimos esta propiedad
}

export interface Note {
  id: string;
  content: string;
  contactId?: string;
  createdAt: Date;
}
