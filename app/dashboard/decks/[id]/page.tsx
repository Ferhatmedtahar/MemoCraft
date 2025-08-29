"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BookOpen, Play, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Flashcard {
  question: string;
  answer: string;
  hint: string;
}

// Mock deck data - replace with actual data fetching
const mockDeck = {
  id: 1,
  deck_name: "Spanish Vocabulary",
  color: "#ef4444",
  content: [
    { question: "Hello", answer: "Hola", hint: "Ho..." },
    { question: "Goodbye", answer: "Adiós", hint: "Ad..." },
    { question: "Thank you", answer: "Gracias", hint: "Gr..." },
  ],
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
};

function IndividualDeckPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [deck, setDeck] = useState(mockDeck);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCard, setCurrentCard] = useState<Flashcard>({
    question: "",
    answer: "",
    hint: "",
  });

  // Generate hint automatically when answer changes
  const generateHint = (answer: string): string => {
    if (!answer) return "";

    // For numbers, return the number itself
    if (/^\d+$/.test(answer.trim())) {
      return answer;
    }

    // For text, return first 2 characters + "..."
    const trimmed = answer.trim();
    if (trimmed.length <= 2) return trimmed;
    return trimmed.substring(0, 2) + "...";
  };

  const handleAnswerChange = (value: string) => {
    const hint = generateHint(value);
    setCurrentCard((prev) => ({
      ...prev,
      answer: value,
      hint: hint,
    }));
  };

  const addFlashcard = async () => {
    if (!currentCard.question.trim() || !currentCard.answer.trim()) {
      toast.error("Please fill in both question and answer");
      return;
    }

    setIsLoading(true);
    try {
      const newCard = {
        ...currentCard,
        hint: currentCard.hint || generateHint(currentCard.answer),
      };

      // Add to local state (replace with actual API call)
      setDeck((prev) => ({
        ...prev,
        content: [...prev.content, newCard],
      }));

      setCurrentCard({ question: "", answer: "", hint: "" });
      toast.success("Flashcard added!");
    } catch (error) {
      toast.error("Failed to add flashcard");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFlashcard = async (index: number) => {
    try {
      // Remove from local state (replace with actual API call)
      setDeck((prev) => ({
        ...prev,
        content: prev.content.filter((_, i) => i !== index),
      }));
      toast.success("Flashcard removed");
    } catch (error) {
      toast.error("Failed to remove flashcard");
    }
  };

  const startStudySession = () => {
    if (deck.content.length === 0) {
      toast.error("Add some flashcards before starting a study session");
      return;
    }
    // Navigate to study mode (implement later)
    toast.info("Study mode coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: deck.color }}
            />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {deck.deck_name}
              </h1>
              <p className="text-muted-foreground">
                {deck.content.length} flashcard
                {deck.content.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={startStudySession}
            disabled={deck.content.length === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Study
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </Dialog.Trigger>
            <Dialog.Content className="sm:max-w-[425px]">
              <Dialog.Header>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Add New Flashcard</span>
                </div>
                <Dialog.Description>
                  Add a new question and answer to your deck
                </Dialog.Description>
              </Dialog.Header>

              <div className="space-y-4">
                <div>
                  <Label>Question</Label>
                  <Input
                    placeholder="Enter your question..."
                    value={currentCard.question}
                    onChange={(e) =>
                      setCurrentCard((prev) => ({
                        ...prev,
                        question: e.target.value,
                      }))
                    }
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label>Answer</Label>
                  <Input
                    placeholder="Enter the answer..."
                    value={currentCard.answer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label>Hint (auto-generated)</Label>
                  <Input
                    placeholder="Hint will be generated automatically"
                    value={currentCard.hint}
                    onChange={(e) =>
                      setCurrentCard((prev) => ({
                        ...prev,
                        hint: e.target.value,
                      }))
                    }
                    disabled={isLoading}
                    className="bg-gray-50"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                      setCurrentCard({ question: "", answer: "", hint: "" });
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addFlashcard} disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Card"}
                  </Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog>
        </div>
      </div>

      {/* Flashcards List */}
      {deck.content.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deck.content.map((card, index) => (
            <Card key={index} className="relative group">
              <Card.Header className="pb-2">
                <div className="flex items-start justify-between">
                  <Card.Title className="text-base font-medium pr-8">
                    {card.question}
                  </Card.Title>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFlashcard(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </Card.Header>
              <Card.Content className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Answer:
                  </span>
                  <p className="text-sm">{card.answer}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Hint:
                  </span>
                  <p className="text-sm text-gray-600">{card.hint}</p>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Content className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No flashcards yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your deck by adding your first flashcard
            </p>
            <Dialog open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Card
                </Button>
              </Dialog.Trigger>
              {/* Same dialog content as above */}
              <Dialog.Content className="sm:max-w-[425px]">
                <Dialog.Header>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Add New Flashcard</span>
                  </div>
                  <Dialog.Description>
                    Add a new question and answer to your deck
                  </Dialog.Description>
                </Dialog.Header>

                <div className="space-y-4">
                  <div>
                    <Label>Question</Label>
                    <Input
                      placeholder="Enter your question..."
                      value={currentCard.question}
                      onChange={(e) =>
                        setCurrentCard((prev) => ({
                          ...prev,
                          question: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label>Answer</Label>
                    <Input
                      placeholder="Enter the answer..."
                      value={currentCard.answer}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label>Hint (auto-generated)</Label>
                    <Input
                      placeholder="Hint will be generated automatically"
                      value={currentCard.hint}
                      onChange={(e) =>
                        setCurrentCard((prev) => ({
                          ...prev,
                          hint: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                        setCurrentCard({ question: "", answer: "", hint: "" });
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addFlashcard} disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add Card"}
                    </Button>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}

export default IndividualDeckPage;
