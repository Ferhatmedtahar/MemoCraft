import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

function NoFlashCards() {
  return (
    <Card>
      <Card.Content className="text-center py-12">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No flashcards yet</h3>
        <p className="text-muted-foreground mb-4">
          Start building your deck by adding your first flashcard
        </p>
      </Card.Content>
    </Card>
  );
}

export default NoFlashCards;
