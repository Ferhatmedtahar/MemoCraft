"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { updateDeck } from "../data/deck.actions";
import { DeckType } from "../types/deck.type";

const deckFormSchema = z.object({
  deck_name: z
    .string()
    .min(1, "Deck name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
  color: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Please enter a valid hex color"
    ),
});

const defaultColors = [
  "#6366f1", // indigo
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
];

interface EditDeckDialogProps {
  deck: DeckType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeckUpdated?: () => void;
}

export default function EditDeckDialog({
  deck,
  open,
  onOpenChange,
  onDeckUpdated,
}: EditDeckDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof deckFormSchema>>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: {
      deck_name: deck.deck_name,
      description: deck.description || "",
      color: deck.color,
    },
  });

  // Update form values when deck prop changes
  useEffect(() => {
    form.reset({
      deck_name: deck.deck_name,
      description: deck.description || "",
      color: deck.color,
    });
  }, [deck, form]);

  const onSubmit = async (values: z.infer<typeof deckFormSchema>) => {
    setIsLoading(true);
    try {
      const result = await updateDeck(
        deck.id,
        values.deck_name,
        values.description || "",
        values.color
      );

      if (result.success) {
        toast.success("Deck updated successfully!");
        onDeckUpdated?.();
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update deck");
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
            <Edit3 className="h-5 w-5" />
            <span>Edit Deck</span>
          </div>
          <Dialog.Description>
            Update your flashcard deck details
          </Dialog.Description>
        </Dialog.Header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="deck_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter deck name..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter deck description..."
                      {...field}
                      disabled={isLoading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Color</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border-2 border-gray-300"
                          style={{ backgroundColor: field.value }}
                        />
                        <Input
                          type="text"
                          placeholder="#6366f1"
                          {...field}
                          disabled={isLoading}
                          className="font-mono"
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {defaultColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => field.onChange(color)}
                            className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                              field.value === color
                                ? "border-gray-800 ring-2 ring-gray-400"
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                            disabled={isLoading}
                          />
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Deck"}
              </Button>
            </div>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
}
