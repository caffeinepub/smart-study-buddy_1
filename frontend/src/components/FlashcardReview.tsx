import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCw, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FlashcardReviewProps {
  flashcards: Array<{
    id: bigint;
    question: string;
    answer: string;
  }>;
  onExit: () => void;
}

export default function FlashcardReview({ flashcards, onExit }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Mode</h1>
          <p className="text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onExit}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Flashcard */}
      <Card
        className="border-2 cursor-pointer min-h-[400px] flex items-center justify-center"
        onClick={handleFlip}
      >
        <CardContent className="p-12 text-center">
          <div className="space-y-6">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {isFlipped ? 'Answer' : 'Question'}
            </div>
            <p className="text-2xl font-medium leading-relaxed">
              {isFlipped ? currentCard.answer : currentCard.question}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <RotateCw className="h-4 w-4" />
              <span>Tap to flip</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          size="lg"
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft className="h-5 w-5" />
          Previous
        </Button>
        <Button onClick={handleFlip} size="lg" variant="secondary" className="gap-2">
          <RotateCw className="h-5 w-5" />
          Flip Card
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          size="lg"
          variant="outline"
          className="gap-2"
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
