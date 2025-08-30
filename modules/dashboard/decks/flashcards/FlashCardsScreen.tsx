"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FlashCardPageType } from "../features/types/deck.type";
import AddFlashcardDialog from "../flashcards/components/AddFlashcardDialog";
import AIFlashcardDialog from "../flashcards/components/AiFlashCardDialog";
import FlashcardItem from "./components/FlashcardItem";
import NoFlashCards from "./components/NoFlashCards";

function IndividualDeckScreen({ deckInfo }: { deckInfo: FlashCardPageType }) {
  const router = useRouter();

  const handleCardUpdated = () => {
    router.refresh();
  };

  const handleCardDeleted = () => {
    router.refresh();
  };

  const handleCardAdded = () => {
    // Force page refresh to get updated data
    router.refresh();
  };

  const handleAICardsAdded = () => {
    // Force page refresh to get updated data
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex flex-col items-start gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-full flex-shrink-0"
              style={{ backgroundColor: deckInfo.color }}
            />
            <div className="min-w-0">
              <h1 className="capitalize  text-2xl sm:text-3xl font-bold text-foreground break-words">
                {deckInfo.deck_name}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {deckInfo.content.length} flashcard
                {deckInfo.content.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 w-full sm:w-auto">
            <Link href={`/dashboard/decks/study/${deckInfo.id}`}>
              <Button
                variant="outline"
                disabled={deckInfo.content.length === 0}
                className="w-full sm:w-auto"
              >
                <Play className="h-4 w-4 mr-2" />
                Study
              </Button>
            </Link>

            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
              <AddFlashcardDialog
                className="w-full sm:w-auto"
                deckId={deckInfo.id}
                onCardAdded={handleCardAdded}
              />

              <AIFlashcardDialog
                className="w-full sm:w-auto"
                deckId={deckInfo.id}
                onCardsAdded={handleAICardsAdded}
              />
            </div>
          </div>

          <p className="text-muted-foreground text-sm sm:text-base">
            Last time score {deckInfo.last_correct_answers}/
            {deckInfo.content.length}
          </p>
        </div>
      </div>

      {/* Flashcards List */}
      <div className="flex items-center justify-center h-[70%]">
        {deckInfo.content.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
            {deckInfo.content.map((card, index) => (
              <FlashcardItem
                key={index}
                deckId={deckInfo.id}
                card={card}
                cardIndex={index}
                onCardUpdated={handleCardUpdated}
                onCardDeleted={handleCardDeleted}
              />
            ))}
          </div>
        ) : (
          <NoFlashCards />
        )}
      </div>
    </div>
  );
}

export default IndividualDeckScreen;
// "use client";

// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Play } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { FlashCardPageType } from "../features/types/deck.type";
// import AddFlashcardDialog from "../flashcards/components/AddFlashcardDialog";
// import FlashcardItem from "./components/FlashcardItem";
// import NoFlashCards from "./components/NoFlashCards";

// function IndividualDeckScreen({ deckInfo }: { deckInfo: FlashCardPageType }) {
//   const router = useRouter();

//   const startStudySession = () => {
//     if (deckInfo.content.length === 0) {
//       toast.error("Add some flashcards before starting a study session");
//       return;
//     }

//     toast.info("Study mode coming soon!");
//   };

//   const handleCardUpdated = () => {
//     router.refresh();
//   };

//   const handleCardDeleted = () => {
//     router.refresh();
//   };

//   const handleCardAdded = () => {
//     // Force page refresh to get updated data
//     router.refresh();
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       {/* <div className="flex items-start justify-between">
//         <div className="flex flex-col items-start gap-4">
//           <Button variant="outline" size="sm" onClick={() => router.back()}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </Button>
//           <div className="flex items-center space-x-2">
//             <div
//               className="w-6 h-6 rounded-full"
//               style={{ backgroundColor: deckInfo.color }}
//             />
//             <div>
//               <h1 className="text-3xl font-bold text-foreground">
//                 {deckInfo.deck_name}
//               </h1>
//               <p className="text-muted-foreground">
//                 {deckInfo.content.length} flashcard
//                 {deckInfo.content.length !== 1 ? "s" : ""}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <Button
//             variant="outline"
//             onClick={startStudySession}
//             disabled={deckInfo.content.length === 0}
//           >
//             <Play className="h-4 w-4 mr-2" />
//             Study
//           </Button>

//           <AddFlashcardDialog
//             deckId={deckInfo.id}
//             onCardAdded={handleCardAdded}
//           />
//         </div>
//       </div> */}

//       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//         <div className="flex flex-col items-start gap-4">
//           <Button variant="outline" size="sm" onClick={() => router.back()}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back
//           </Button>
//           <div className="flex items-center space-x-2">
//             <div
//               className="w-6 h-6 rounded-full flex-shrink-0"
//               style={{ backgroundColor: deckInfo.color }}
//             />
//             <div className="min-w-0">
//               <h1 className="text-2xl sm:text-3xl font-bold text-foreground break-words">
//                 {deckInfo.deck_name}
//               </h1>
//               <p className="text-muted-foreground text-sm sm:text-base">
//                 {deckInfo.content.length} flashcard
//                 {deckInfo.content.length !== 1 ? "s" : ""}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row  items-stretch sm:items-center gap-2 sm:space-x-2 w-full sm:w-auto">
//           <Button
//             variant="outline"
//             onClick={startStudySession}
//             disabled={deckInfo.content.length === 0}
//             className="w-full sm:w-auto "
//           >
//             <Play className="h-4 w-4 mr-2" />
//             Study
//           </Button>

//           <div>
//             <AddFlashcardDialog
//               className={"w-full sm:w-auto "}
//               deckId={deckInfo.id}
//               onCardAdded={handleCardAdded}
//             />
//           </div>
//         </div>
//       </div>
//       {/* Flashcards List */}
//       <div className="flex items-center justify-center h-[70%]">
//         {deckInfo.content.length > 0 ? (
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
//             {deckInfo.content.map((card, index) => (
//               <FlashcardItem
//                 key={index}
//                 deckId={deckInfo.id}
//                 card={card}
//                 cardIndex={index}
//                 onCardUpdated={handleCardUpdated}
//                 onCardDeleted={handleCardDeleted}
//               />
//             ))}
//           </div>
//         ) : (
//           <NoFlashCards />
//         )}
//       </div>
//     </div>
//   );
// }

// export default IndividualDeckScreen;
// // "use client";
// // import { Button } from "@/components/ui/button";
// // import { Card } from "@/components/ui/card";
// // import { Dialog } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { ArrowLeft, BookOpen, Play, Plus, Trash2 } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import { useState } from "react";
// // import { toast } from "sonner";
// // import { FlashCardPageType } from "../features/types/deck.type";
// // import NoFlashCards from "./features/components/NoFlashCards";

// // interface Flashcard {
// //   question: string;
// //   answer: string;
// //   hint: string;
// // }

// // // <div className="flex flex-col gap-1 text-xs">
// // {
// //   /* <p> Created at {format(deckInfo.created_at, "dd/MM/yyyy")}</p> */
// // }
// // {
// //   /* <p> Updated at {format(deckInfo.updated_at, "dd/MM/yyyy")}</p> */
// // }
// // {
// //   /* </div> */
// // }
// // function IndividualDeckScreen({ deckInfo }: { deckInfo: FlashCardPageType }) {
// //   console.log("deckInfo", deckInfo.content.length);
// //   const router = useRouter();
// //   const [deck, setDeck] = useState(deckInfo);
// //   const [open, setOpen] = useState(false);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [currentCard, setCurrentCard] = useState<Flashcard>({
// //     question: "",
// //     answer: "",
// //     hint: "",
// //   });

// //   // Generate hint automatically when answer changes
// //   const generateHint = (answer: string): string => {
// //     if (!answer) return "";

// //     // For numbers, return the number itself
// //     if (/^\d+$/.test(answer.trim())) {
// //       return answer;
// //     }

// //     // For text, return first 2 characters + "..."
// //     const trimmed = answer.trim();
// //     if (trimmed.length <= 2) return trimmed;
// //     return trimmed.substring(0, 1) + "...";
// //   };

// //   const handleAnswerChange = (value: string) => {
// //     const hint = generateHint(value);
// //     setCurrentCard((prev) => ({
// //       ...prev,
// //       answer: value,
// //       hint: hint,
// //     }));
// //   };

// //   const addFlashcard = async () => {
// //     if (!currentCard.question.trim() || !currentCard.answer.trim()) {
// //       toast.error("Please fill in both question and answer");
// //       return;
// //     }

// //     setIsLoading(true);
// //     try {
// //       const newCard = {
// //         ...currentCard,
// //         hint: currentCard.hint || generateHint(currentCard.answer),
// //       };

// //       setDeck((prev) => ({
// //         ...prev,
// //         content: [...prev.content, newCard],
// //       }));

// //       setCurrentCard({ question: "", answer: "", hint: "" });
// //       toast.success("Flashcard added!");
// //     } catch (error) {
// //       toast.error("Failed to add flashcard");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const removeFlashcard = async (index: number) => {
// //     try {
// //       // Remove from local state (replace with actual API call)
// //       setDeck((prev) => ({
// //         ...prev,
// //         content: prev.content.filter((_, i) => i !== index),
// //       }));
// //       toast.success("Flashcard removed");
// //     } catch (error) {
// //       toast.error("Failed to remove flashcard");
// //     }
// //   };

// //   const startStudySession = () => {
// //     if (deck.content.length === 0) {
// //       toast.error("Add some flashcards before starting a study session");
// //       return;
// //     }
// //     // Navigate to study mode (implement later)
// //     toast.info("Study mode coming soon!");
// //   };

// //   return (
// //     <div className="space-y-6 h-full">
// //       {/* Header */}
// //       <div className="flex items-start justify-between">
// //         <div className="flex flex-col items-center gap-4 space-x-4">
// //           <Button variant="outline" size="sm" onClick={() => router.back()}>
// //             <ArrowLeft className="h-4 w-4 mr-2" />
// //             Back
// //           </Button>
// //           <div className="flex items-center space-x-2">
// //             <div
// //               className="w-6 h-6 rounded-full"
// //               style={{ backgroundColor: deckInfo.color }}
// //             />
// //             <div>
// //               <h1 className="text-3xl font-bold text-foreground">
// //                 {deck.deck_name}
// //               </h1>
// //               <p className="text-muted-foreground">
// //                 {deck.content.length} flashcard
// //                 {deck.content.length !== 1 ? "s" : ""}
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="flex items-center space-x-2">
// //           <Button
// //             variant="outline"
// //             onClick={startStudySession}
// //             disabled={deck.content.length === 0}
// //           >
// //             <Play className="h-4 w-4 mr-2" />
// //             Study
// //           </Button>

// //           <Dialog open={open} onOpenChange={setOpen}>
// //             <Dialog.Trigger asChild>
// //               <Button>
// //                 <Plus className="h-4 w-4 mr-2" />
// //                 Add Card
// //               </Button>
// //             </Dialog.Trigger>
// //             <Dialog.Content className="sm:max-w-[425px]">
// //               <Dialog.Header>
// //                 <div className="flex items-center space-x-2">
// //                   <BookOpen className="h-5 w-5" />
// //                   <span>Add New Flashcard</span>
// //                 </div>
// //                 <Dialog.Description>
// //                   Add a new question and answer to your deck
// //                 </Dialog.Description>
// //               </Dialog.Header>

// //               <div className="space-y-4">
// //                 <div>
// //                   <Label>Question</Label>
// //                   <Input
// //                     placeholder="Enter your question..."
// //                     value={currentCard.question}
// //                     onChange={(e) =>
// //                       setCurrentCard((prev) => ({
// //                         ...prev,
// //                         question: e.target.value,
// //                       }))
// //                     }
// //                     disabled={isLoading}
// //                   />
// //                 </div>

// //                 <div>
// //                   <Label>Answer</Label>
// //                   <Input
// //                     placeholder="Enter the answer..."
// //                     value={currentCard.answer}
// //                     onChange={(e) => handleAnswerChange(e.target.value)}
// //                     disabled={isLoading}
// //                   />
// //                 </div>

// //                 <div>
// //                   <Label>Hint (auto-generated)</Label>
// //                   <Input
// //                     placeholder="Hint will be generated automatically"
// //                     value={currentCard.hint}
// //                     onChange={(e) =>
// //                       setCurrentCard((prev) => ({
// //                         ...prev,
// //                         hint: e.target.value,
// //                       }))
// //                     }
// //                     disabled={isLoading}
// //                     className="bg-gray-50"
// //                   />
// //                 </div>

// //                 <div className="flex justify-end space-x-2">
// //                   <Button
// //                     variant="outline"
// //                     onClick={() => {
// //                       setOpen(false);
// //                       setCurrentCard({ question: "", answer: "", hint: "" });
// //                     }}
// //                     disabled={isLoading}
// //                   >
// //                     Cancel
// //                   </Button>
// //                   <Button onClick={addFlashcard} disabled={isLoading}>
// //                     {isLoading ? "Adding..." : "Add Card"}
// //                   </Button>
// //                 </div>
// //               </div>
// //             </Dialog.Content>
// //           </Dialog>
// //         </div>
// //       </div>

// //       {/* Flashcards List */}
// //       <div className="flex items-center justify-center h-[70%]">
// //         {deck.content.length > 0 ? (
// //           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// //             {deck.content.map((card, index) => (
// //               <Card key={index} className="relative group">
// //                 <Card.Header className="pb-2">
// //                   <div className="flex items-start justify-between">
// //                     <Card.Title className="text-base font-medium pr-8">
// //                       {card.question}
// //                     </Card.Title>
// //                     <Button
// //                       variant="ghost"
// //                       size="sm"
// //                       onClick={() => removeFlashcard(index)}
// //                       className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
// //                     >
// //                       <Trash2 className="h-4 w-4 text-red-500" />
// //                     </Button>
// //                   </div>
// //                 </Card.Header>
// //                 <Card.Content className="space-y-2">
// //                   <div>
// //                     <span className="text-sm font-medium text-muted-foreground">
// //                       Answer:
// //                     </span>
// //                     <p className="text-sm">{card.answer}</p>
// //                   </div>
// //                   <div>
// //                     <span className="text-sm font-medium text-muted-foreground">
// //                       Hint:
// //                     </span>
// //                     <p className="text-sm text-gray-600">{card.hint}</p>
// //                   </div>
// //                 </Card.Content>
// //               </Card>
// //             ))}
// //           </div>
// //         ) : (
// //           <NoFlashCards />
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // export default IndividualDeckScreen;
