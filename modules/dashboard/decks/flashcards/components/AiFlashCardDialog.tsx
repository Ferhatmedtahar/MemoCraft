"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  fetchNoteById,
  fetchNotes,
} from "@/modules/dashboard/notes/data/fetchData";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateFlashcardsWithAI } from "../data/AiFlashcards.action";
import { addFlashcard } from "../data/FlashCards.action";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface AIFlashcardDialogProps {
  deckId: string;
  onCardsAdded?: () => void;
  className?: string;
}

export default function AIFlashcardDialog({
  className,
  deckId,
  onCardsAdded,
}: AIFlashcardDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [numberOfCards, setNumberOfCards] = useState<number>(5);
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Fetch notes when dialog opens
  useEffect(() => {
    if (open) {
      loadNotes();
    }
  }, [open]);

  const loadNotes = async () => {
    setLoadingNotes(true);
    try {
      const notesData = await fetchNotes();
      if (notesData) {
        setNotes(
          notesData.map((note) => ({
            id: note.id,
            title: note.title || "Untitled Note",
            content: note.content || "",
          }))
        );
      }
    } catch (error) {
      toast.error("Failed to load notes");
      console.error(error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!selectedNoteId) {
      toast.error("Please select a note");
      return;
    }

    if (numberOfCards < 1 || numberOfCards > 20) {
      toast.error("Number of cards must be between 1 and 20");
      return;
    }

    setIsLoading(true);
    try {
      // Get the selected note content
      const noteResult = await fetchNoteById(selectedNoteId);
      if (!noteResult.success || !noteResult.data) {
        toast.error("Failed to fetch note content");
        return;
      }

      // Generate flashcards with AI
      const result = await generateFlashcardsWithAI(
        noteResult.data.content,
        numberOfCards
      );

      if (!result.success) {
        toast.error(result.error || "Failed to generate flashcards");
        return;
      }

      // Add each generated flashcard to the deck
      let successCount = 0;
      for (const flashcard of result.flashcards) {
        try {
          const addResult = await addFlashcard(deckId, flashcard);
          if (addResult.success) {
            successCount++;
          }
        } catch (error) {
          console.error("Error adding flashcard:", error);
        }
      }

      if (successCount > 0) {
        toast.success(
          `Successfully generated and added ${successCount} flashcard${
            successCount !== 1 ? "s" : ""
          }!`
        );
        onCardsAdded?.();
        handleClose();
      } else {
        toast.error("Failed to add generated flashcards");
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
    setSelectedNoteId("");
    setNumberOfCards(5);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" className={className || ""}>
          <Sparkles className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Generate with AI</span>
          <span className="sm:hidden">AI</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content
        className="w-[95vw] max-w-[425px] mx-auto"
        overlay={{ className: "px-4" }}
      >
        <Dialog.Header>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-foreground flex-shrink-0" />
            <span className="text-sm sm:text-base">
              Generate Flashcards with AI
            </span>
          </div>
          <Dialog.Description className="text-xs sm:text-sm">
            Select a note and let AI create flashcards for you
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.Body className="px-2 sm:px-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Select Note</Label>
              <Select
                value={selectedNoteId}
                onValueChange={setSelectedNoteId}
                disabled={isLoading || loadingNotes}
              >
                <Select.Trigger className="w-full">
                  <Select.Value
                    placeholder={
                      loadingNotes ? "Loading notes..." : "Choose a note"
                    }
                  />
                </Select.Trigger>
                <Select.Content className="max-w-[calc(95vw-2rem)]">
                  {notes.length === 0 && !loadingNotes && (
                    <Select.Item value="no-notes" disabled>
                      No notes found
                    </Select.Item>
                  )}
                  {notes.map((note) => (
                    <Select.Item key={note.id} value={note.id}>
                      <span className="truncate">{note.title}</span>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Number of Flashcards
              </Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={numberOfCards}
                onChange={(e) =>
                  setNumberOfCards(parseInt(e.target.value) || 5)
                }
                disabled={isLoading}
                placeholder="1-20"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Recommended: 5-10 cards per note
              </p>
            </div>
          </div>
        </Dialog.Body>

        <Dialog.Footer className="px-2 sm:px-4 flex-col sm:flex-row gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto order-2 sm:order-1 flex items-center justify-center"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerateFlashcards}
            disabled={isLoading || !selectedNoteId || loadingNotes}
            className="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
                <span className="sm:hidden">Loading...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Generate Cards</span>
                <span className="sm:hidden">Generate</span>
              </>
            )}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
// "use client";

// import { Button } from "@/components/ui/button";
// import { Dialog } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select } from "@/components/ui/select";
// import {
//   fetchNoteById,
//   fetchNotes,
// } from "@/modules/dashboard/notes/data/fetchData";
// import { Loader2, Sparkles } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { generateFlashcardsWithAI } from "../data/AiFlashcards.action";
// import { addFlashcard } from "../data/FlashCards.action";

// interface Note {
//   id: string;
//   title: string;
//   content: string;
// }

// interface AIFlashcardDialogProps {
//   deckId: string;
//   onCardsAdded?: () => void;
//   className?: string;
// }

// export default function AIFlashcardDialog({
//   className,
//   deckId,
//   onCardsAdded,
// }: AIFlashcardDialogProps) {
//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [selectedNoteId, setSelectedNoteId] = useState<string>("");
//   const [numberOfCards, setNumberOfCards] = useState<number>(5);
//   const [loadingNotes, setLoadingNotes] = useState(false);

//   // Fetch notes when dialog opens
//   useEffect(() => {
//     if (open) {
//       loadNotes();
//     }
//   }, [open]);

//   const loadNotes = async () => {
//     setLoadingNotes(true);
//     try {
//       const notesData = await fetchNotes();
//       if (notesData) {
//         setNotes(
//           notesData.map((note) => ({
//             id: note.id,
//             title: note.title || "Untitled Note",
//             content: note.content || "",
//           }))
//         );
//       }
//     } catch (error) {
//       toast.error("Failed to load notes");
//       console.error(error);
//     } finally {
//       setLoadingNotes(false);
//     }
//   };

//   const handleGenerateFlashcards = async () => {
//     if (!selectedNoteId) {
//       toast.error("Please select a note");
//       return;
//     }

//     if (numberOfCards < 1 || numberOfCards > 20) {
//       toast.error("Number of cards must be between 1 and 20");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Get the selected note content
//       const noteResult = await fetchNoteById(selectedNoteId);
//       if (!noteResult.success || !noteResult.data) {
//         toast.error("Failed to fetch note content");
//         return;
//       }

//       // Generate flashcards with AI
//       const result = await generateFlashcardsWithAI(
//         noteResult.data.content,
//         numberOfCards
//       );

//       if (!result.success) {
//         toast.error(result.error || "Failed to generate flashcards");
//         return;
//       }

//       // Add each generated flashcard to the deck
//       let successCount = 0;
//       for (const flashcard of result.flashcards) {
//         try {
//           const addResult = await addFlashcard(deckId, flashcard);
//           if (addResult.success) {
//             successCount++;
//           }
//         } catch (error) {
//           console.error("Error adding flashcard:", error);
//         }
//       }

//       if (successCount > 0) {
//         toast.success(
//           `Successfully generated and added ${successCount} flashcard${
//             successCount !== 1 ? "s" : ""
//           }!`
//         );
//         onCardsAdded?.();
//         handleClose();
//       } else {
//         toast.error("Failed to add generated flashcards");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setSelectedNoteId("");
//     setNumberOfCards(5);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <Dialog.Trigger asChild>
//         <Button variant="outline" className={className || ""}>
//           <Sparkles className="h-4 w-4 mr-2" />
//           Generate with AI
//         </Button>
//       </Dialog.Trigger>
//       <Dialog.Content className=" sm:max-w-[425px]">
//         <Dialog.Header>
//           <div className="flex items-center space-x-2">
//             <Sparkles className="h-5 w-5 text-foreground" />
//             <span>Generate Flashcards with AI</span>
//           </div>
//           <Dialog.Description>
//             Select a note and let AI create flashcards for you
//           </Dialog.Description>
//         </Dialog.Header>

//         <div className="space-y-4 pt-2">
//           <div>
//             <Label>Select Note</Label>
//             <Select
//               value={selectedNoteId}
//               onValueChange={setSelectedNoteId}
//               disabled={isLoading || loadingNotes}
//             >
//               <Select.Trigger>
//                 <Select.Value
//                   className=" p-2"
//                   placeholder={
//                     loadingNotes
//                       ? "Loading notes..."
//                       : "Choose a note to generate flashcards from"
//                   }
//                 />
//               </Select.Trigger>
//               <Select.Content>
//                 {notes.length === 0 && !loadingNotes && (
//                   <Select.Item value="no-notes" disabled>
//                     No notes found
//                   </Select.Item>
//                 )}
//                 {notes.map((note) => (
//                   <Select.Item key={note.id} value={note.id}>
//                     {note.title}
//                   </Select.Item>
//                 ))}
//               </Select.Content>
//             </Select>
//           </div>

//           <div>
//             <Label>Number of Flashcards</Label>
//             <Input
//               type="number"
//               min="1"
//               max="20"
//               value={numberOfCards}
//               onChange={(e) => setNumberOfCards(parseInt(e.target.value) || 5)}
//               disabled={isLoading}
//               placeholder="Enter number of flashcards (1-20)"
//             />
//             <p className="text-xs text-muted-foreground mt-1">
//               Recommended: 5-10 cards per note
//             </p>
//           </div>

//           <div className="flex justify-end space-x-2">
//             <Button
//               variant="outline"
//               onClick={handleClose}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleGenerateFlashcards}
//               disabled={isLoading || !selectedNoteId || loadingNotes}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <Sparkles className="h-4 w-4 mr-2" />
//                   Generate Cards
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </Dialog.Content>
//     </Dialog>
//   );
// }
