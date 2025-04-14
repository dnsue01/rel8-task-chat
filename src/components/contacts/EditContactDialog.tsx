
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useCrm } from "../../context/CrmContext";
import { Contact, ContactStatus } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Debe ser un email válido").or(z.string().length(0)).optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["lead", "client", "collaborator", "personal"])
});

interface EditContactDialogProps {
  contact: Contact;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const EditContactDialog: React.FC<EditContactDialogProps> = ({ contact, trigger, onSuccess }) => {
  const [open, setOpen] = React.useState(false);
  const { updateContact } = useCrm();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contact.name,
      email: contact.email || "",
      phone: contact.phone || "",
      company: contact.company || "",
      status: contact.status
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateContact(contact.id, {
      name: values.name,
      email: values.email,
      phone: values.phone,
      company: values.company,
      status: values.status as ContactStatus
    });

    toast({
      title: "Contacto actualizado",
      description: `${values.name} ha sido actualizado correctamente.`
    });

    setOpen(false);
    if (onSuccess) onSuccess();
  };

  // Handle closing manually to prevent automatic closure
  const handleOpenChange = (newOpen: boolean) => {
    if (open && !newOpen) {
      // Only allow closing via the cancel button or save changes
      // This prevents closing when clicking outside or pressing escape
      return;
    }
    setOpen(newOpen);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-2" /> Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Contacto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;
