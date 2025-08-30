"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteDeck } from "../data/deck.actions";
import { DeckType } from "../types/deck.type";

interface DeleteDeckDialogProps {
  deck: DeckType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeckDeleted?: () => void;
}

export default function DeleteDeckDialog({
  deck,
  open,
  onOpenChange,
  onDeckDeleted,
}: DeleteDeckDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteDeck(deck.id);

      if (result.success) {
        toast.success("Deck deleted successfully!");
        onDeckDeleted?.();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to delete deck");
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
      <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Header>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Delete Deck</span>
          </div>
          <Dialog.Description>
            Are you sure you want to delete this deck? This action cannot be
            undone and will permanently delete all flashcards in this deck.
          </Dialog.Description>
        </Dialog.Header>

        <div className="py-4">
          <div className="bg-red-50 dark:bg-red-900/20 p-4  border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-2 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: deck.color }}
              />
              <h4 className="font-medium text-red-800 dark:text-red-200">
                {deck.deck_name}
              </h4>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">
              {deck.description || "No description"}
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 border border-yellow-200 dark:border-yellow-800 mb-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Warning:</strong> All flashcards in this deck will be
              permanently deleted. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Deck"}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
