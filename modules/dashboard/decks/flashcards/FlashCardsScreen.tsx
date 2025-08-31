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
