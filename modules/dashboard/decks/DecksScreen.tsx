import { Card } from "@/components/ui/card";
import CreateDeckDialog from "./features/components/CreateFlashCardDesck";
import DeckCard from "./features/components/DeckCard";
import { fetchDecks } from "./features/data/fetchData";

async function FlashCardsScreen() {
  const { success, data } = await fetchDecks();
  if (!success) return <div>Something went wrong</div>;
  return (
    <div className="space-y-6">
      {/* Responsive Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground break-words">
            Decks
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base break-words">
            Create and study with interactive flashcards
          </p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-auto">
          <CreateDeckDialog />
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data && data?.length > 0 ? (
          data.map((deck) => {
            return <DeckCard deck={deck} key={deck.id} />;
          })
        ) : (
          <div className="col-span-full">
            <Card className="border-dashed border-2 bg-gradient-to-br from-primary/5 via-background to-background py-16 flex flex-col items-center justify-center text-center">
              <div className="bg-primary/10 p-6 rounded-full mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h10" />
                  <path d="M7 12h10" />
                  <path d="M7 17h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2 break-words">No flashcard decks yet</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto break-words">
                Create your first deck to help memorize and review important information effectively using active recall.
              </p>
              <CreateDeckDialog />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlashCardsScreen;
