import { Button } from "@/components/ui/button";
import { fetchDeckById } from "@/modules/dashboard/decks/features/data/fetchData";
import IndividualDeckScreen from "@/modules/dashboard/decks/flashcards/FlashCardsScreen";
import Link from "next/link";

async function IdCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { success, data: deckInfo } = await fetchDeckById(id);
  if (!success) {
    return (
      <div className="h-full flex flex-col justify-center items-center">
        <p className="text-center text-muted-foreground mt-10">
          Deck not found
        </p>
        <Button className="mt-4">
          <Link href="/dashboard/decks">Back to Decks</Link>
        </Button>
      </div>
    );
  }
  console.log("deck", deckInfo);
  return <IndividualDeckScreen deckInfo={deckInfo} />;
}

export default IdCardPage;
