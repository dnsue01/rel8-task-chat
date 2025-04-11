
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
  const { addContacts } = useCrm();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processCSV = (text: string) => {
    const lines = text.split("\n");
    
    // Find header line and map columns
    let headerLine = lines.find(line => line.includes("Name") && line.includes("E-mail"))?.split(",");
    if (!headerLine) {
      toast({
        title: "Error de formato CSV",
        description: "No se encontró una cabecera de CSV con 'Name' y 'E-mail'",
        variant: "destructive"
      });
      return [];
    }
    
    // Find column indexes
    const nameIndex = headerLine.findIndex(col => col.includes("Name"));
    const emailIndex = headerLine.findIndex(col => col.includes("E-mail"));
    const phoneIndex = headerLine.findIndex(col => col.includes("Phone") || col.includes("Mobile"));
    const companyIndex = headerLine.findIndex(col => col.includes("Company") || col.includes("Organization"));
    
    if (nameIndex === -1 || emailIndex === -1) {
      toast({
        title: "Error de formato CSV",
        description: "No se encontraron las columnas necesarias de nombre y email",
        variant: "destructive"
      });
      return [];
    }
    
    // Process data lines (skip header)
    const contacts: Omit<Contact, "id" | "lastActivity">[] = [];
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
      
      // Extract data
      const name = cells[nameIndex]?.replace(/"/g, "").trim();
      const email = cells[emailIndex]?.replace(/"/g, "").trim();
      
      if (name && email) {
        const phone = phoneIndex !== -1 ? cells[phoneIndex]?.replace(/"/g, "").trim() : undefined;
        const company = companyIndex !== -1 ? cells[companyIndex]?.replace(/"/g, "").trim() : undefined;
        
        contacts.push({
          name,
          email,
          phone,
          company,
          status: "lead" as ContactStatus,
          tags: [],
        });
      }
    });
    
    return contacts;
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setProcessing(true);
    
    try {
      const text = await file.text();
      const contacts = processCSV(text);
      
      if (contacts.length === 0) {
        toast({
          title: "Importación vacía",
          description: "No se encontraron contactos válidos para importar",
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }
      
      // Import contacts in batch
      await addContacts(contacts);
      
      toast({
        title: "Importación completada",
        description: `Se han importado ${contacts.length} contactos correctamente`,
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
