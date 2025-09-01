import { fetchDeckById } from "@/modules/dashboard/decks/features/data/fetchData";
import StudyScreen from "@/modules/dashboard/decks/study/StudyScreen";
import { redirect } from "next/navigation";
// import { fetchDeckById } from "@/modules/dashboard/decks/actions/study-actions";
// import StudyScreen from "@/modules/dashboard/decks/components/StudyScreen";

async function StudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const result = await fetchDeckById(id);

  if (!result.success || !result.data) {
    redirect("/dashboard");
  }

  // Check if deck has flashcards
  if (!result.data.content || result.data.content.length === 0) {
    redirect(`/dashboard/deck/${id}`);
  }

  return <StudyScreen deckData={result.data} />;
}

export default StudyPage;
