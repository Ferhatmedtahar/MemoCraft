import { Card } from "@/components/ui/card";
import CreateDeckDialog from "./features/components/CreateFlashCardDesck";
import DeckCard from "./features/components/DeckCard";
import { fetchDecks } from "./features/data/fetchData";
async function FlashCardsScreen() {
  const { success, data } = await fetchDecks();
  if (!success) return <div>Something went wrong</div>;
  console.log(data);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Flashcards</h1>
          <p className="text-muted-foreground mt-2">
            Create and study with interactive flashcards
          </p>
        </div>
        <CreateDeckDialog />
      </div>
      <div className="flex flex-wrap gap-4">
        {data && data?.length > 0 ? (
          data.map((deck) => {
            return <DeckCard deck={deck} key={deck.id} />;
          })
        ) : (
          <Card>
            <Card.Header>
              <Card.Title>Study Sessions</Card.Title>
              <Card.Description>
                Create flashcard decks to help memorize and review important
                information.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="text-muted-foreground">
                No flashcard decks yet. Create your first deck to start
                studying!
              </p>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  );
}

export default FlashCardsScreen;
