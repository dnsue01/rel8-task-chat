import React, { useState } from "react";
import { useCrm } from "../../context/CrmContext";
import { Contact, ContactStatus } from "../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ImportContactsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ImportContactsDialog: React.FC<ImportContactsDialogProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const { addContacts, contacts } = useCrm();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processCSV = (text: string) => {
    const lines = text.split("\n");

    let headerLine = lines.find(line =>
      line.includes("First Name") &&
      (line.includes("Phone 1 - Value") || line.includes("Phone"))
    )?.split(",");

    if (!headerLine) {
      toast({
        title: "Error de formato CSV",
        description: "No se encontró una cabecera con 'First Name' y campo de teléfono",
        variant: "destructive",
      });
      return [];
    }

    const firstNameIndex = headerLine.findIndex(col => col.includes("First Name"));
    const middleNameIndex = headerLine.findIndex(col => col.includes("Middle Name"));
    const lastNameIndex = headerLine.findIndex(col => col.includes("Last Name"));
    const phoneIndex = headerLine.findIndex(col =>
      col.includes("Phone 1 - Value") || (col.includes("Phone") && col.includes("Value"))
    );

    if (firstNameIndex === -1 || phoneIndex === -1) {
      toast({
        title: "Error de formato CSV",
        description: "No se encontraron las columnas necesarias de nombre y teléfono",
        variant: "destructive",
      });
      return [];
    }

    const existingPhones = new Map();
    contacts.forEach(contact => {
      if (contact.phone) {
        const standardizedPhone = contact.phone.replace(/[^\d+]/g, "");
        existingPhones.set(standardizedPhone, contact.id);
      }
    });

    const newContacts: Omit<Contact, "id" | "lastActivity">[] = [];
    const duplicates: { name: string; phone: string }[] = [];
    const dataLines = lines.slice(lines.indexOf(headerLine.join(",")) + 1);

    dataLines.forEach(line => {
      if (!line.trim()) return;

      const cells: string[] = [];
      let currentCell = "";
      let isQuoted = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          isQuoted = !isQuoted;
        } else if (char === ',' && !isQuoted) {
          cells.push(currentCell);
          currentCell = "";
        } else {
          currentCell += char;
        }
      }
      cells.push(currentCell);

      const firstName = cells[firstNameIndex]?.replace(/"/g, "").trim() || "";
      const middleName = middleNameIndex !== -1 ? cells[middleNameIndex]?.replace(/"/g, "").trim() || "" : "";
      const lastName = lastNameIndex !== -1 ? cells[lastNameIndex]?.replace(/"/g, "").trim() || "" : "";
      const nameParts = [firstName, middleName, lastName].filter(Boolean);
      const fullName = nameParts.join(" ");
      let phone = cells[phoneIndex]?.replace(/"/g, "").trim() || "";
      phone = phone.replace(/[^\d+]/g, "");

      if (fullName && phone) {
        if (existingPhones.has(phone)) {
          duplicates.push({ name: fullName, phone });
        } else {
          newContacts.push({
            name: fullName,
            phone,
            email: "",
            status: "lead" as ContactStatus,
            tags: [],
          });
          existingPhones.set(phone, "new");
        }
      }
    });

    if (duplicates.length > 0) {
      toast({
        title: `${duplicates.length} contactos duplicados omitidos`,
        description: `Se han encontrado ${duplicates.length} contactos con números de teléfono ya existentes.`,
      });
    }

    return newContacts;
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setProcessing(true);

    try {
      const text = await file.text();
      const contactsToImport = processCSV(text);

      if (contactsToImport.length === 0) {
        toast({
          title: "Importación vacía",
          description: "No se encontraron contactos válidos para importar",
          variant: "destructive",
        });
        setProcessing(false);
        return;
      }

      await addContacts(contactsToImport);

      toast({
        title: "Importación completada",
        description: `Se han importado ${contactsToImport.length} contactos correctamente`,
      });

      setFile(null);
      onOpenChange(false); // cerrar el modal

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error al importar",
        description: "Ha ocurrido un error al procesar el archivo CSV",
        variant: "destructive",
      });
      console.error("Error importing contacts:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Importar Contactos</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleImport} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">Archivo CSV (Formato Google Contacts)</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              El archivo debe estar en formato CSV exportado desde Google Contacts.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={processing}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!file || processing}>
              {processing ? "Procesando..." : "Importar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsDialog;
