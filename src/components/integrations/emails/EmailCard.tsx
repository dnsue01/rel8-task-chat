
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Link2 } from "lucide-react";
import { Email } from "@/types/integrations";
import { Note } from "@/types/index";
import { format } from "date-fns";

interface EmailCardProps {
  email: Email;
  notes: Note[];
  onLinkNote: (noteId: string) => void;
}

const EmailCard: React.FC<EmailCardProps> = ({ email, notes, onLinkNote }) => {
  const linkedNote = notes.find((n) => n.id === email.linkedNoteId);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">{email.subject}</h3>
          <p className="text-sm text-gray-500">
            De: {email.sender}
          </p>
          <p className="text-sm text-gray-500">
            Para: {email.recipients.join(", ")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">
            {format(email.receivedAt, "HH:mm")}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t">
        <p className="text-sm line-clamp-3 mb-4">{email.content}</p>

        {linkedNote ? (
          <div className="bg-gray-50 p-3 rounded text-sm">
            <div className="flex justify-between">
              <p className="font-medium text-xs text-gray-500 mb-1">
                Nota vinculada
              </p>
            </div>
            <p className="text-gray-700">{linkedNote.content}</p>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">No hay nota vinculada</p>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  <span>Vincular nota</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="end">
                <Command>
                  <CommandList>
                    <CommandEmpty>No hay notas disponibles</CommandEmpty>
                    <CommandGroup>
                      {notes.map((note) => (
                        <CommandItem
                          key={note.id}
                          onSelect={() => onLinkNote(note.id)}
                          className="cursor-pointer"
                        >
                          <span className="truncate">{note.content}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCard;
