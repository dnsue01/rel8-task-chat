
import React, { useState } from "react";
import { useCrm } from "../../context/CrmContext";
import { Contact } from "../../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface NewContactFormProps {
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (contactId: string) => void;
}

const NewContactForm: React.FC<NewContactFormProps> = ({ 
  trigger, 
  isOpen, 
  onOpenChange,
  onSuccess 
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { addContact } = useCrm();

  // Use controlled or uncontrolled dialog state
  const isDialogOpen = isOpen !== undefined ? isOpen : dialogOpen;
  const setIsDialogOpen = onOpenChange || setDialogOpen;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) return;
    
    const newContact = await addContact({
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      tags: [],
    });

    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setIsDialogOpen(false);
    
    // Call the onSuccess callback if provided
    if (onSuccess && newContact) {
      onSuccess(newContact.id);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir nuevo contacto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Nombre del contacto" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="email@ejemplo.com" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="(opcional)" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input 
              id="company" 
              value={company} 
              onChange={(e) => setCompany(e.target.value)} 
              placeholder="(opcional)" 
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar Contacto</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewContactForm;
