"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addFlashcard } from "../data/FlashCards.action";

interface Flashcard {
  question: string;
  answer: string;
  hint: string;
}

interface AddFlashcardDialogProps {
  deckId: string;
  onCardAdded?: () => void;
}

export default function AddFlashcardDialog({
  deckId,
  onCardAdded,
}: AddFlashcardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCard, setCurrentCard] = useState<Flashcard>({
    question: "",
    answer: "",
    hint: "",
  });

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

  const handleAddFlashcard = async () => {
    if (!currentCard.question.trim() || !currentCard.answer.trim()) {
      toast.error("Please fill in both question and answer");
      return;
    }

    setIsLoading(true);
    try {
      const newCard = {
        ...currentCard,
        hint: currentCard.hint || generateHint(currentCard.answer),
      };

      const result = await addFlashcard(deckId, newCard);

      if (result.success) {
        setCurrentCard({ question: "", answer: "", hint: "" });
        toast.success("Flashcard added successfully!");
        onCardAdded?.();
        // Don't close dialog - keep it open for adding more cards
      } else {
        toast.error(result.error || "Failed to add flashcard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentCard({ question: "", answer: "", hint: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Header>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Add New Flashcard</span>
          </div>
          <Dialog.Description>
            Add a new question and answer to your deck
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
              onClick={handleClose}
              disabled={isLoading}
            >
              Close
            </Button>
            <Button onClick={handleAddFlashcard} disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Card"}
            </Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
