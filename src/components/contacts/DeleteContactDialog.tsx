
import React from "react";
import { useCrm } from "../../context/CrmContext";
import { Contact } from "../../types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DeleteContactDialogProps {
  contact: Contact;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

const DeleteContactDialog: React.FC<DeleteContactDialogProps> = ({
  contact,
  trigger,
  onSuccess
}) => {
  const { deleteContact } = useCrm();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    deleteContact(contact.id);
    
    toast({
      title: "Contacto eliminado",
      description: `${contact.name} ha sido eliminado correctamente.`
    });

    setOpen(false);
    if (onSuccess) onSuccess();
  };

  // Handle closing manually to prevent automatic closure
  const handleOpenChange = (newOpen: boolean) => {
    if (open && !newOpen) {
      // Only allow closing via the cancel button or delete button
      // This prevents closing when clicking outside or pressing escape
      return;
    }
    setOpen(newOpen);
  };
  
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" /> Eliminar
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent onPointerDownOutside={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará permanentemente el contacto <strong>{contact.name}</strong> y
            todos sus datos asociados (notas y tareas). Esta acción no puede deshacerse.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteContactDialog;
