"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit3 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateFlashcard } from "../data/FlashCards.action";

interface Flashcard {
  question: string;
  answer: string;
  hint: string;
}

interface EditFlashcardDialogProps {
  deckId: string;
  cardIndex: number;
  card: Flashcard;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCardUpdated?: () => void;
}

export default function EditFlashcardDialog({
  deckId,
  cardIndex,
  card,
  open,
  onOpenChange,
  onCardUpdated,
}: EditFlashcardDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentCard, setCurrentCard] = useState<Flashcard>(card);

  // Update local state when card prop changes
  useEffect(() => {
    setCurrentCard(card);
  }, [card]);

  // Generate hint automatically when answer changes
  const generateHint = (answer: string): string => {
    if (!answer) return "";

    // For numbers, return the number itself
    if (/^\d+$/.test(answer.trim())) {
      return answer;
    }

    // For text, return first 1 character + "..."
    const trimmed = answer.trim();
    if (trimmed.length <= 1) return trimmed;
    return trimmed.substring(0, 1) + "...";
  };

  const handleAnswerChange = (value: string) => {
    const hint = generateHint(value);
    setCurrentCard((prev) => ({
      ...prev,
      answer: value,
      hint: hint,
    }));
  };

  const handleUpdateFlashcard = async () => {
    if (!currentCard.question.trim() || !currentCard.answer.trim()) {
      toast.error("Please fill in both question and answer");
      return;
    }

    setIsLoading(true);
    try {
      const updatedCard = {
        ...currentCard,
        hint: currentCard.hint || generateHint(currentCard.answer),
      };

      const result = await updateFlashcard(deckId, cardIndex, updatedCard);

      if (result.success) {
        toast.success("Flashcard updated successfully!");
        onCardUpdated?.();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update flashcard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content className="w-[95vw] max-w-[425px] sm:w-full">
        <Dialog.Header>
          <div className="flex items-center space-x-2">
            <Edit3 className="h-5 w-5" />
            <span>Edit Flashcard</span>
          </div>
          <Dialog.Description>
            Update the question and answer for this flashcard
          </Dialog.Description>
        </Dialog.Header>

        <div className="space-y-4">
          <div>
            <Label>Question</Label>
            <Input
              placeholder="Enter your question..."
              value={currentCard.question}
              onChange={(e) =>
                setCurrentCard((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
              disabled={isLoading}
            />
          </div>

          <div>
            <Label>Answer</Label>
            <Input
              placeholder="Enter the answer..."
              value={currentCard.answer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label>Hint (auto-generated)</Label>
            <Input
              placeholder="Hint will be generated automatically"
              value={currentCard.hint}
              onChange={(e) =>
                setCurrentCard((prev) => ({
                  ...prev,
                  hint: e.target.value,
                }))
              }
              disabled={isLoading}
              className="bg-gray-50"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateFlashcard} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Card"}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
