
import React, { useState } from "react";
import { useCrm } from "../../context/CrmContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenSquare, Send } from "lucide-react";

interface AddNoteFormProps {
  contactId: string;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ contactId }) => {
  const [content, setContent] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { addNote } = useCrm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await addNote({
      contactId,
      content
    });

    // Reset form
    setContent("");
    setIsFormVisible(false);
  };

  if (!isFormVisible) {
    return (
      <Button 
        onClick={() => setIsFormVisible(true)} 
        className="mt-4 flex items-center gap-2"
      >
        <PenSquare size={16} /> Añadir Nota
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        placeholder="Escribe tu nota aquí..."
        className="min-h-[100px]"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
      />
      <div className="mt-3 flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setIsFormVisible(false)}
        >
          Cancelar
        </Button>
        <Button type="submit" className="flex items-center gap-2">
          <Send size={16} /> Guardar Nota
        </Button>
      </div>
    </form>
  );
};

export default AddNoteForm;
