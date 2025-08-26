import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FlashcardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Flashcards</h1>
          <p className="text-muted-foreground mt-2">
            Create and study with interactive flashcards
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Deck
        </Button>
      </div>

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
            No flashcard decks yet. Create your first deck to start studying!
          </p>
        </Card.Content>
      </Card>
    </div>
  );
}
