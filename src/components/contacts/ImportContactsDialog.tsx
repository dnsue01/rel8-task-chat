
import React, { useState } from "react";
import { useCrm } from "../../context/CrmContext";
import { Contact, ContactStatus } from "../../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Import } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImportContactsDialogProps {
  onSuccess?: () => void;
}

const ImportContactsDialog: React.FC<ImportContactsDialogProps> = ({ onSuccess }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    
    // Find header line to map columns
    let headerLine = lines.find(line => 
      line.includes("First Name") && 
      (line.includes("Phone 1 - Value") || line.includes("Phone"))
    )?.split(",");
    
    if (!headerLine) {
      toast({
        title: "Error de formato CSV",
        description: "No se encontró una cabecera con 'First Name' y campo de teléfono",
        variant: "destructive"
      });
      return [];
    }
    
    // Find column indexes for name components and phone
    const firstNameIndex = headerLine.findIndex(col => col.includes("First Name"));
    const middleNameIndex = headerLine.findIndex(col => col.includes("Middle Name"));
    const lastNameIndex = headerLine.findIndex(col => col.includes("Last Name"));
    const phoneIndex = headerLine.findIndex(col => 
      col.includes("Phone 1 - Value") || 
      (col.includes("Phone") && col.includes("Value"))
    );
    
    if (firstNameIndex === -1 || phoneIndex === -1) {
      toast({
        title: "Error de formato CSV",
        description: "No se encontraron las columnas necesarias de nombre y teléfono",
        variant: "destructive"
      });
      return [];
    }
    
    // Create a map of existing phone numbers to check for duplicates
    const existingPhones = new Map();
    contacts.forEach(contact => {
      if (contact.phone) {
        // Standardize the phone number for comparison
        const standardizedPhone = contact.phone.replace(/[^\d+]/g, "");
        existingPhones.set(standardizedPhone, contact.id);
      }
    });
    
    // Process data lines (skip header)
    const newContacts: Omit<Contact, "id" | "lastActivity">[] = [];
    const duplicates: {name: string, phone: string}[] = [];
    const dataLines = lines.slice(lines.indexOf(headerLine.join(",")) + 1);
    
    dataLines.forEach(line => {
      if (!line.trim()) return; // Skip empty lines
      
      // Handle quoted cells properly
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
      cells.push(currentCell); // Add the last cell
      
      // Extract and combine name components
      const firstName = cells[firstNameIndex]?.replace(/"/g, "").trim() || "";
      const middleName = middleNameIndex !== -1 ? cells[middleNameIndex]?.replace(/"/g, "").trim() || "" : "";
      const lastName = lastNameIndex !== -1 ? cells[lastNameIndex]?.replace(/"/g, "").trim() || "" : "";
      
      // Combine name components, filtering out empty parts
      const nameParts = [firstName, middleName, lastName].filter(part => part.length > 0);
      const fullName = nameParts.join(" ");
      
      // Clean and extract phone number
      let phone = cells[phoneIndex]?.replace(/"/g, "").trim() || "";
      // Remove non-standard characters except for +
      phone = phone.replace(/[^\d+]/g, "");
      
      // Only add if we have a name and the phone is not already in our contacts
      if (fullName && phone) {
        // Check if this phone number already exists in our contacts
        if (existingPhones.has(phone)) {
          duplicates.push({ name: fullName, phone });
        } else {
          // Add to new contacts list and to our tracking map to catch duplicates within the import file
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
    
    // If we have duplicates, show a toast with the count
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
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }
      
      // Import contacts in batch
      await addContacts(contactsToImport);
      
      toast({
        title: "Importación completada",
        description: `Se han importado ${contactsToImport.length} contactos correctamente`,
      });
      
      // Reset and close dialog
      setFile(null);
      setIsDialogOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Error al importar",
        description: "Ha ocurrido un error al procesar el archivo CSV",
        variant: "destructive"
      });
      console.error("Error importing contacts:", error);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Import size={16} /> Importar Contactos
        </Button>
      </DialogTrigger>
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
              <Button type="button" variant="outline" disabled={processing}>Cancelar</Button>
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
