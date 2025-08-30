"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit3, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteFlashcard } from "../data/FlashCards.action";
import EditFlashcardDialog from "./EditFlashcardDialog";

interface Flashcard {
  question: string;
  answer: string;
  hint: string;
}

interface FlashcardItemProps {
  deckId: string;
  card: Flashcard;
  cardIndex: number;
  onCardUpdated?: () => void;
  onCardDeleted?: () => void;
}

export default function FlashcardItem({
  deckId,
  card,
  cardIndex,
  onCardUpdated,
  onCardDeleted,
}: FlashcardItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleDeleteCard = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteFlashcard(deckId, cardIndex);

      if (result.success) {
        toast.success("Flashcard deleted successfully!");
        onCardDeleted?.();
      } else {
        toast.error(result.error || "Failed to delete flashcard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="relative group">
        <Card.Header className="pb-2">
          <div className="flex items-start justify-between">
            <Card.Title className="text-base font-medium pr-8">
              {card.question}
            </Card.Title>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={isDeleting}
                  // onClick={(e) => e.stopPropagation()}
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   e.stopPropagation();
                  // }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                {/* <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                  disabled={isDeleting}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setEditDialogOpen(true)}
                  className="cursor-pointer"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteCard}
                  className="cursor-pointer text-red-600 hover:text-red-700"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card.Header>
        <Card.Content className="space-y-2">
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Answer:
            </span>
            <p className="text-sm">{card.answer}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Hint:
            </span>
            <p className="text-sm text-gray-600">{card.hint}</p>
          </div>
        </Card.Content>
      </Card>

      <EditFlashcardDialog
        deckId={deckId}
        cardIndex={cardIndex}
        card={card}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onCardUpdated={onCardUpdated}
      />
    </>
  );
}
