import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface FlashcardListProps {
  flashcards: Array<{
    id: bigint;
    question: string;
    answer: string;
  }>;
}

export default function FlashcardList({ flashcards }: FlashcardListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {flashcards.map((card) => (
        <Card key={Number(card.id)} className="border-2 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-3">
              <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
              <p className="font-medium text-sm line-clamp-3">{card.question}</p>
            </div>
            <div className="pl-8">
              <p className="text-xs text-muted-foreground line-clamp-2">{card.answer}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
