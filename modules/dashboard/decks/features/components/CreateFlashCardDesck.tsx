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
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createDeck } from "../data/createDeck";

const deckFormSchema = z.object({
  deck_name: z
    .string()
    .min(1, "Deck name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
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

export default function CreateDeckDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof deckFormSchema>>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: {
      deck_name: "",
      description: "",
      color: "#6366f1",
    },
  });

  const onSubmit = async (values: z.infer<typeof deckFormSchema>) => {
    setIsLoading(true);
    try {
      const result = await createDeck(values);

      if (result.success && result.data) {
        toast.success("Deck created successfully!");
        form.reset();
        setOpen(false);

        // Navigate to the new deck page
        router.push(`/dashboard/decks/${result.data.id}`);
      } else {
        toast.error(result.error || "Failed to create deck");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Deck
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="w-[95vw] max-w-[425px] sm:w-full">
        <Dialog.Header>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Create New Deck</span>
          </div>
          <Dialog.Description>
            Create a new flashcard deck. You can add questions and answers after
            creating the deck.
          </Dialog.Description>
        </Dialog.Header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="pt-2 space-y-6"
          >
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
            />{" "}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter deck description..."
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
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Deck"}
              </Button>
            </div>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
}
