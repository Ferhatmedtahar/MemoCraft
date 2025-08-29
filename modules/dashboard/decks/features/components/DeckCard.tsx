import { Card } from "@/components/ui/card";
import Link from "next/link";
import { DeckType } from "../types/deck.type";
function DeckCard({ deck }: { deck: DeckType }) {
  return (
    <Link href={`/dashboard/decks/${deck.id}`} key={deck.id}>
      <Card style={{ backgroundColor: `${deck.color}70` }} key={deck.id}>
        <Card.Header>
          <Card.Title>{deck.deck_name}</Card.Title>
          {deck.description ? (
            <Card.Description>{deck.description}</Card.Description>
          ) : (
            <Card.Description>No description</Card.Description>
          )}
        </Card.Header>
      </Card>
    </Link>
  );
}

export default DeckCard;
