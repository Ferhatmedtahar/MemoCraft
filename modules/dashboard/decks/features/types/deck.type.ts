export type DeckType = {
  id: string;
  deck_name: string;
  description: string;
  color: string;
};

export type FlashCardPageType = {
  id: string;
  user_id: string;
  color: string;
  deck_name: string;
  description: string;
  content: Flashcard[];
  last_correct_answers: number;
  created_at: string;
  updated_at: string;
};
interface Flashcard {
  question: string;
  answer: string;
  hint: string;
}
