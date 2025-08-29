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
      <Dialog.Content className="sm:max-w-[425px]">
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
// "use client";
// import { Button } from "@/components/ui/button";
// import { Dialog } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { BookOpen, Plus, Trash2 } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import * as z from "zod";
// import { createFlashcardDeck } from "../data/createFlashCard";

// const flashcardSchema = z.object({
//   question: z.string().min(1, "Question is required"),
//   answer: z.string().min(1, "Answer is required"),
//   hint: z.string().min(1, "Hint is required"),
// });

// const deckFormSchema = z.object({
//   deck_name: z
//     .string()
//     .min(1, "Deck name is required")
//     .max(100, "Name must be less than 100 characters"),
//   color: z
//     .string()
//     .regex(
//       /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
//       "Please enter a valid hex color"
//     ),
//   content: z
//     .array(flashcardSchema)
//     .min(1, "At least one flashcard is required"),
// });

// const defaultColors = [
//   "#6366f1", // indigo
//   "#3b82f6", // blue
//   "#10b981", // emerald
//   "#f59e0b", // amber
//   "#ef4444", // red
//   "#8b5cf6", // violet
//   "#ec4899", // pink
//   "#06b6d4", // cyan
// ];

// interface Flashcard {
//   question: string;
//   answer: string;
//   hint: string;
// }

// export default function CreateFlashcardDeckDialog() {
//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
//   const [currentCard, setCurrentCard] = useState<Flashcard>({
//     question: "",
//     answer: "",
//     hint: "",
//   });

//   const form = useForm<z.infer<typeof deckFormSchema>>({
//     resolver: zodResolver(deckFormSchema),
//     defaultValues: {
//       deck_name: "",
//       color: "#6366f1",
//       content: [],
//     },
//   });

//   // Generate hint automatically when answer changes
//   const generateHint = (answer: string): string => {
//     if (!answer) return "";

//     // For numbers, return the number itself
//     if (/^\d+$/.test(answer.trim())) {
//       return answer;
//     }

//     // For text, return first 2 characters + "..."
//     const trimmed = answer.trim();
//     if (trimmed.length <= 2) return trimmed;
//     return trimmed.substring(0, 2) + "...";
//   };

//   const handleAnswerChange = (value: string) => {
//     const hint = generateHint(value);
//     setCurrentCard((prev) => ({
//       ...prev,
//       answer: value,
//       hint: hint,
//     }));
//   };

//   const addFlashcard = () => {
//     if (!currentCard.question.trim() || !currentCard.answer.trim()) {
//       toast.error("Please fill in both question and answer");
//       return;
//     }

//     const newCard = {
//       ...currentCard,
//       hint: currentCard.hint || generateHint(currentCard.answer),
//     };

//     setFlashcards((prev) => [...prev, newCard]);
//     setCurrentCard({ question: "", answer: "", hint: "" });
//     toast.success("Flashcard added!");
//   };

//   const removeFlashcard = (index: number) => {
//     setFlashcards((prev) => prev.filter((_, i) => i !== index));
//     toast.success("Flashcard removed");
//   };

//   const onSubmit = async (values: z.infer<typeof deckFormSchema>) => {
//     if (flashcards.length === 0) {
//       toast.error("Please add at least one flashcard");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const deckData = {
//         ...values,
//         content: flashcards,
//       };

//       const result = await createFlashcardDeck(deckData);

//       if (result.success) {
//         toast.success("Flashcard deck created successfully!");
//         form.reset();
//         setFlashcards([]);
//         setCurrentCard({ question: "", answer: "", hint: "" });
//         setOpen(false);
//       } else {
//         toast.error(result.error || "Failed to create flashcard deck");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetDialog = () => {
//     form.reset();
//     setFlashcards([]);
//     setCurrentCard({ question: "", answer: "", hint: "" });
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(newOpen) => {
//         setOpen(newOpen);
//         if (!newOpen) resetDialog();
//       }}
//     >
//       <Dialog.Trigger asChild>
//         <Button>
//           <BookOpen className="mr-2 h-4 w-4" />
//           Create Flashcard Deck
//         </Button>
//       </Dialog.Trigger>
//       <Dialog.Content className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
//         <Dialog.Header>
//           Create New Flashcard Deck
//           <Dialog.Description>
//             Create a new flashcard deck with custom questions and answers
//           </Dialog.Description>
//         </Dialog.Header>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Deck Name */}
//             <FormField
//               control={form.control}
//               name="deck_name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Deck Name</FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Enter deck name..."
//                       {...field}
//                       disabled={isLoading}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Color Picker */}
//             <FormField
//               control={form.control}
//               name="color"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Color</FormLabel>
//                   <FormControl>
//                     <div className="space-y-3">
//                       <div className="flex items-center space-x-2">
//                         <div
//                           className="w-6 h-6 rounded border-2 border-gray-300"
//                           style={{ backgroundColor: field.value }}
//                         />
//                         <Input
//                           type="text"
//                           placeholder="#6366f1"
//                           {...field}
//                           disabled={isLoading}
//                           className="font-mono"
//                         />
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {defaultColors.map((color) => (
//                           <button
//                             key={color}
//                             type="button"
//                             onClick={() => field.onChange(color)}
//                             className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
//                               field.value === color
//                                 ? "border-gray-800 ring-2 ring-gray-400"
//                                 : "border-gray-300"
//                             }`}
//                             style={{ backgroundColor: color }}
//                             disabled={isLoading}
//                           />
//                         ))}
//                       </div>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Add Flashcard Section */}
//             <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
//               <h3 className="font-semibold text-lg">Add Flashcards</h3>

//               <div className="space-y-3">
//                 <div>
//                   <Label>Question</Label>
//                   <Input
//                     placeholder="Enter your question..."
//                     value={currentCard.question}
//                     onChange={(e) =>
//                       setCurrentCard((prev) => ({
//                         ...prev,
//                         question: e.target.value,
//                       }))
//                     }
//                     disabled={isLoading}
//                   />
//                 </div>

//                 <div>
//                   <Label>Answer</Label>
//                   <Input
//                     placeholder="Enter the answer..."
//                     value={currentCard.answer}
//                     onChange={(e) => handleAnswerChange(e.target.value)}
//                     disabled={isLoading}
//                   />
//                 </div>

//                 <div>
//                   <Label>Hint (auto-generated)</Label>
//                   <Input
//                     placeholder="Hint will be generated automatically"
//                     value={currentCard.hint}
//                     onChange={(e) =>
//                       setCurrentCard((prev) => ({
//                         ...prev,
//                         hint: e.target.value,
//                       }))
//                     }
//                     disabled={isLoading}
//                     className="bg-gray-100"
//                   />
//                 </div>

//                 <Button
//                   type="button"
//                   onClick={addFlashcard}
//                   disabled={isLoading}
//                   className="w-full"
//                   variant="outline"
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Flashcard
//                 </Button>
//               </div>
//             </div>

//             {/* Flashcards List */}
//             {flashcards.length > 0 && (
//               <div className="space-y-4">
//                 <h3 className="font-semibold text-lg">
//                   Flashcards ({flashcards.length})
//                 </h3>
//                 <div className="space-y-2 max-h-40 overflow-y-auto">
//                   {flashcards.map((card, index) => (
//                     <div
//                       key={index}
//                       className="flex items-start space-x-2 p-3 bg-white rounded border"
//                     >
//                       <div className="flex-1 min-w-0">
//                         <div className="text-sm font-medium truncate">
//                           Q: {card.question}
//                         </div>
//                         <div className="text-sm text-gray-600 truncate">
//                           A: {card.answer}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           Hint: {card.hint}
//                         </div>
//                       </div>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => removeFlashcard(index)}
//                         disabled={isLoading}
//                       >
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Submit Buttons */}
//             <div className="flex justify-end space-x-2 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setOpen(false)}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 disabled={isLoading || flashcards.length === 0}
//               >
//                 {isLoading ? "Creating..." : "Create Deck"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </Dialog.Content>
//     </Dialog>
//   );
// }
