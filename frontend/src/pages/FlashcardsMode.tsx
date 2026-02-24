import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Play } from 'lucide-react';
import { useFlashcards, useAddFlashcard } from '@/hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FlashcardReview from '@/components/FlashcardReview';
import FlashcardList from '@/components/FlashcardList';

export default function FlashcardsMode() {
  const { data: flashcards = [], isLoading } = useFlashcards();
  const addFlashcard = useAddFlashcard();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const handleAddFlashcard = () => {
    if (question.trim() && answer.trim()) {
      addFlashcard.mutate(
        { question: question.trim(), answer: answer.trim() },
        {
          onSuccess: () => {
            setQuestion('');
            setAnswer('');
            setDialogOpen(false);
          },
        }
      );
    }
  };

  if (reviewMode && flashcards.length > 0) {
    return <FlashcardReview flashcards={flashcards} onExit={() => setReviewMode(false)} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Flashcards</h1>
          <p className="text-muted-foreground">Quick revision with question and answer cards</p>
        </div>
        <div className="flex gap-3">
          {flashcards.length > 0 && (
            <Button size="lg" variant="secondary" className="gap-2" onClick={() => setReviewMode(true)}>
              <Play className="h-5 w-5" />
              Start Review
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                New Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Flashcard</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    placeholder="Enter your question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    placeholder="Enter the answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                </div>
                <Button onClick={handleAddFlashcard} disabled={addFlashcard.isPending} className="w-full" size="lg">
                  {addFlashcard.isPending ? 'Creating...' : 'Create Flashcard'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading flashcards...</p>
      ) : flashcards.length > 0 ? (
        <FlashcardList flashcards={flashcards} />
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🎴</div>
            <p className="text-muted-foreground mb-4">No flashcards yet. Create your first flashcard to start!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
