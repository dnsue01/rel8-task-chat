
import React, { useState } from "react";
import { useCrm } from "../../context/CrmContext";
import { Contact, ContactStatus } from "../../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";

interface NewContactFormProps {
  trigger?: React.ReactNode;
}

const NewContactForm: React.FC<NewContactFormProps> = ({ trigger }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<ContactStatus>("lead");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addContact } = useCrm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) return;
    
    await addContact({
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
      status,
      tags: [],
    });

    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setStatus("lead");
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full flex items-center justify-center gap-2">
            <Plus size={16} /> Añadir Contacto
          </Button>
        )}
      </DialogTrigger>
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
          
          <div className="space-y-2">
            <Label>Estado</Label>
            <RadioGroup value={status} onValueChange={(value) => setStatus(value as ContactStatus)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lead" id="lead" />
                <Label htmlFor="lead">Lead</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client">Cliente</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="collaborator" id="collaborator" />
                <Label htmlFor="collaborator">Colaborador</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal">Personal</Label>
              </div>
            </RadioGroup>
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
