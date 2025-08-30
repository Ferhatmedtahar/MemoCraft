"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateDeckStudyResults } from "../study/data/study.action";

interface Flashcard {
  question: string;
  answer: string;
  hint: string;
}

interface DeckData {
  id: string;
  deck_name: string;
  color: string;
  content: Flashcard[];
  description?: string;
}

interface StudyScreenProps {
  deckData: DeckData;
}

enum StudyMode {
  QUESTION = "question",
  HINT = "hint",
  ANSWER = "answer",
  COMPLETED = "completed",
}

function StudyScreen({ deckData }: StudyScreenProps) {
  const router = useRouter();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studyMode, setStudyMode] = useState<StudyMode>(StudyMode.QUESTION);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);

  // Shuffle cards on component mount
  useEffect(() => {
    const shuffled = [...deckData.content].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  }, [deckData.content]);

  const currentCard = shuffledCards[currentCardIndex];
  const totalCards = shuffledCards.length;
  const progress = ((currentCardIndex + 1) / totalCards) * 100;

  const showHint = () => {
    setStudyMode(StudyMode.HINT);
  };

  const showAnswer = () => {
    setStudyMode(StudyMode.ANSWER);
  };

  const markCorrect = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentCardIndex] = true;
    setUserAnswers(newAnswers);
    nextCard();
  };

  const markIncorrect = () => {
    const newAnswers = [...userAnswers];
    newAnswers[currentCardIndex] = false;
    setUserAnswers(newAnswers);
    nextCard();
  };

  const nextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setStudyMode(StudyMode.QUESTION);
    } else {
      setStudyMode(StudyMode.COMPLETED);
    }
  };

  const restartSession = () => {
    setCurrentCardIndex(0);
    setStudyMode(StudyMode.QUESTION);
    setUserAnswers([]);
    // Reshuffle cards
    const shuffled = [...deckData.content].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  const finishSession = async () => {
    setIsSubmitting(true);
    try {
      const correctCount = userAnswers.filter(
        (answer) => answer === true
      ).length;

      const result = await updateDeckStudyResults(
        deckData.id,
        correctCount,
        totalCards
      );

      if (result.success) {
        toast.success(result.message);
        router.push(`/dashboard/decks/${deckData.id}`);
      } else {
        toast.error(result.message || "Failed to save results");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const correctAnswersCount = userAnswers.filter(
    (answer) => answer === true
  ).length;

  if (totalCards === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg text-muted-foreground">
          This deck has no flashcards to study.
        </p>
        <Button onClick={() => router.push(`/dashboard/deck/${deckData.id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Deck
        </Button>
      </div>
    );
  }

  if (studyMode === StudyMode.COMPLETED) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-6 max-w-md mx-auto p-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h1 className="text-3xl font-bold">Study Session Complete!</h1>
          <div className="text-xl space-y-2">
            <p>
              You got{" "}
              <span className="font-bold text-green-600">
                {correctAnswersCount}
              </span>{" "}
              out of <span className="font-bold">{totalCards}</span> correct
            </p>
            <div className="text-lg text-muted-foreground">
              Score: {Math.round((correctAnswersCount / totalCards) * 100)}%
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="outline"
            onClick={restartSession}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Study Again
          </Button>
          <Button
            onClick={finishSession}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Saving..." : "Finish & Save"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/deck/${deckData.id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Study
        </Button>

        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: deckData.color }}
          />
          <span className="font-medium">{deckData.deck_name}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Card {currentCardIndex + 1} of {totalCards}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Study Card */}
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-2xl p-8">
          <div className="space-y-6">
            {/* Question */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold mb-6">
                {currentCard?.question}
              </h2>

              {/* Show Hint */}
              {studyMode === StudyMode.HINT && (
                <div className="bg-accent p-4 border-2 border-foreground hover:bg-primary/90 transition-all duration-200 ">
                  <p className="text-sm text-primary-foreground mb-1">Hint:</p>
                  <p className="text-lg font-medium text-primary-foreground">
                    {currentCard?.hint}
                  </p>
                </div>
              )}

              {/* Show Answer */}
              {studyMode === StudyMode.ANSWER && (
                <div className="bg-green-50 p-4  border border-green-200">
                  <p className="text-sm text-muted-foreground mb-1">Answer:</p>
                  <p className="text-lg font-medium text-green-700">
                    {currentCard?.answer}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {studyMode === StudyMode.QUESTION && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={showHint}
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Show Hint
                  </Button>
                  <Button onClick={showAnswer} className="w-full sm:w-auto">
                    <EyeOff className="h-4 w-4 mr-2" />
                    Reveal Answer
                  </Button>
                </div>
              )}

              {studyMode === StudyMode.HINT && (
                <div className="flex justify-center">
                  <Button onClick={showAnswer} className="w-full sm:w-auto">
                    <EyeOff className="h-4 w-4 mr-2" />
                    Reveal Answer
                  </Button>
                </div>
              )}

              {studyMode === StudyMode.ANSWER && (
                <div className="space-y-3">
                  <p className="text-center text-sm text-muted-foreground">
                    Did you get it right?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={markIncorrect}
                      className="w-full sm:w-auto "
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      Incorrect
                    </Button>
                    <Button
                      onClick={markCorrect}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Correct
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Summary */}
      {userAnswers.length > 0 && (
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Correct: {correctAnswersCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <XCircle className="h-4 w-4 text-red-500" />
              <span>Incorrect: {userAnswers.length - correctAnswersCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyScreen;
// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import {
//   ArrowLeft,
//   Eye,
//   EyeOff,
//   RotateCcw,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import { updateDeckStudyResults } from "../actions/study-actions";

// interface Flashcard {
//   question: string;
//   answer: string;
//   hint: string;
// }

// interface DeckData {
//   id: string;
//   deck_name: string;
//   color: string;
//   content: Flashcard[];
//   description?: string;
// }

// interface StudyScreenProps {
//   deckData: DeckData;
// }

// enum StudyMode {
//   QUESTION = "question",
//   HINT = "hint",
//   ANSWER = "answer",
//   COMPLETED = "completed",
// }

// function StudyScreen({ deckData }: StudyScreenProps) {
//   const router = useRouter();
//   const [currentCardIndex, setCurrentCardIndex] = useState(0);
//   const [studyMode, setStudyMode] = useState<StudyMode>(StudyMode.QUESTION);
//   const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);

//   // Shuffle cards on component mount
//   useEffect(() => {
//     const shuffled = [...deckData.content].sort(() => Math.random() - 0.5);
//     setShuffledCards(shuffled);
//   }, [deckData.content]);

//   const currentCard = shuffledCards[currentCardIndex];
//   const totalCards = shuffledCards.length;
//   const progress = ((currentCardIndex + 1) / totalCards) * 100;

//   const showHint = () => {
//     setStudyMode(StudyMode.HINT);
//   };

//   const showAnswer = () => {
//     setStudyMode(StudyMode.ANSWER);
//   };

//   const markCorrect = () => {
//     const newAnswers = [...userAnswers];
//     newAnswers[currentCardIndex] = true;
//     setUserAnswers(newAnswers);
//     nextCard();
//   };

//   const markIncorrect = () => {
//     const newAnswers = [...userAnswers];
//     newAnswers[currentCardIndex] = false;
//     setUserAnswers(newAnswers);
//     nextCard();
//   };

//   const nextCard = () => {
//     if (currentCardIndex < totalCards - 1) {
//       setCurrentCardIndex((prev) => prev + 1);
//       setStudyMode(StudyMode.QUESTION);
//     } else {
//       setStudyMode(StudyMode.COMPLETED);
//     }
//   };

//   const restartSession = () => {
//     setCurrentCardIndex(0);
//     setStudyMode(StudyMode.QUESTION);
//     setUserAnswers([]);
//     // Reshuffle cards
//     const shuffled = [...deckData.content].sort(() => Math.random() - 0.5);
//     setShuffledCards(shuffled);
//   };

//   const finishSession = async () => {
//     setIsSubmitting(true);
//     try {
//       const correctCount = userAnswers.filter(
//         (answer) => answer === true
//       ).length;

//       const result = await updateDeckStudyResults(
//         deckData.id,
//         correctCount,
//         totalCards
//       );

//       if (result.success) {
//         toast.success(result.message);
//         router.push(`/dashboard/deck/${deckData.id}`);
//       } else {
//         toast.error(result.message || "Failed to save results");
//       }
//     } catch (error) {
//       toast.error("An unexpected error occurred");
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const correctAnswersCount = userAnswers.filter(
//     (answer) => answer === true
//   ).length;

//   if (totalCards === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen space-y-4">
//         <p className="text-lg text-muted-foreground">
//           This deck has no flashcards to study.
//         </p>
//         <Button onClick={() => router.push(`/dashboard/deck/${deckData.id}`)}>
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Back to Deck
//         </Button>
//       </div>
//     );
//   }

//   if (studyMode === StudyMode.COMPLETED) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen space-y-6 max-w-md mx-auto p-6">
//         <div className="text-center space-y-4">
//           <div className="text-6xl">🎉</div>
//           <h1 className="text-3xl font-bold">Study Session Complete!</h1>
//           <div className="text-xl space-y-2">
//             <p>
//               You got{" "}
//               <span className="font-bold text-green-600">
//                 {correctAnswersCount}
//               </span>{" "}
//               out of <span className="font-bold">{totalCards}</span> correct
//             </p>
//             <div className="text-lg text-muted-foreground">
//               Score: {Math.round((correctAnswersCount / totalCards) * 100)}%
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 w-full">
//           <Button
//             variant="outline"
//             onClick={restartSession}
//             className="w-full sm:w-auto"
//           >
//             <RotateCcw className="h-4 w-4 mr-2" />
//             Study Again
//           </Button>
//           <Button
//             onClick={finishSession}
//             disabled={isSubmitting}
//             className="w-full sm:w-auto"
//           >
//             {isSubmitting ? "Saving..." : "Finish & Save"}
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-4 space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => router.push(`/dashboard/deck/${deckData.id}`)}
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Exit Study
//         </Button>

//         <div className="flex items-center space-x-2">
//           <div
//             className="w-4 h-4 rounded-full"
//             style={{ backgroundColor: deckData.color }}
//           />
//           <span className="font-medium">{deckData.deck_name}</span>
//         </div>
//       </div>

//       {/* Progress */}
//       <div className="space-y-2">
//         <div className="flex justify-between text-sm text-muted-foreground">
//           <span>
//             Card {currentCardIndex + 1} of {totalCards}
//           </span>
//           <span>{Math.round(progress)}% complete</span>
//         </div>
//         <Progress value={progress} className="h-2" />
//       </div>

//       {/* Main Study Card */}
//       <div className="flex justify-center items-center min-h-[60vh]">
//         <Card className="w-full max-w-2xl p-8">
//           <div className="space-y-6">
//             {/* Question */}
//             <div className="text-center space-y-4">
//               <h2 className="text-2xl font-bold mb-6">
//                 {currentCard?.question}
//               </h2>

//               {/* Show Hint */}
//               {studyMode === StudyMode.HINT && (
//                 <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//                   <p className="text-sm text-muted-foreground mb-1">Hint:</p>
//                   <p className="text-lg font-medium text-blue-700">
//                     {currentCard?.hint}
//                   </p>
//                 </div>
//               )}

//               {/* Show Answer */}
//               {studyMode === StudyMode.ANSWER && (
//                 <div className="bg-green-50 p-4 rounded-lg border border-green-200">
//                   <p className="text-sm text-muted-foreground mb-1">Answer:</p>
//                   <p className="text-lg font-medium text-green-700">
//                     {currentCard?.answer}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col space-y-3">
//               {studyMode === StudyMode.QUESTION && (
//                 <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                   <Button
//                     variant="outline"
//                     onClick={showHint}
//                     className="w-full sm:w-auto"
//                   >
//                     <Eye className="h-4 w-4 mr-2" />
//                     Show Hint
//                   </Button>
//                   <Button onClick={showAnswer} className="w-full sm:w-auto">
//                     <EyeOff className="h-4 w-4 mr-2" />
//                     Reveal Answer
//                   </Button>
//                 </div>
//               )}

//               {studyMode === StudyMode.HINT && (
//                 <div className="flex justify-center">
//                   <Button onClick={showAnswer} className="w-full sm:w-auto">
//                     <EyeOff className="h-4 w-4 mr-2" />
//                     Reveal Answer
//                   </Button>
//                 </div>
//               )}

//               {studyMode === StudyMode.ANSWER && (
//                 <div className="space-y-3">
//                   <p className="text-center text-sm text-muted-foreground">
//                     Did you get it right?
//                   </p>
//                   <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                     <Button
//                       variant="outline"
//                       onClick={markIncorrect}
//                       className="w-full sm:w-auto border-red-200 hover:bg-red-50"
//                     >
//                       <XCircle className="h-4 w-4 mr-2 text-red-500" />
//                       Incorrect
//                     </Button>
//                     <Button
//                       onClick={markCorrect}
//                       className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
//                     >
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                       Correct
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Progress Summary */}
//       {userAnswers.length > 0 && (
//         <div className="flex justify-center">
//           <div className="flex items-center space-x-4 text-sm">
//             <div className="flex items-center space-x-1">
//               <CheckCircle className="h-4 w-4 text-green-500" />
//               <span>Correct: {correctAnswersCount}</span>
//             </div>
//             <div className="flex items-center space-x-1">
//               <XCircle className="h-4 w-4 text-red-500" />
//               <span>Incorrect: {userAnswers.length - correctAnswersCount}</span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StudyScreen;
// // import React from "react";

// // function StudyScreen() {
// //   return <div>StudyScreen</div>;
// // }

// // export default StudyScreen;
