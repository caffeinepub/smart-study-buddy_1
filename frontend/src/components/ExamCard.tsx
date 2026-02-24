import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExamCardProps {
  exam: {
    id: bigint;
    name: string;
    date: bigint;
    daysLeft: number | null;
  };
}

export default function ExamCard({ exam }: ExamCardProps) {
  const isPast = exam.daysLeft !== null && exam.daysLeft < 0;
  const isToday = exam.daysLeft === 0;
  const isUrgent = exam.daysLeft !== null && exam.daysLeft > 0 && exam.daysLeft <= 7;

  const getBadgeVariant = () => {
    if (isPast) return 'secondary';
    if (isToday) return 'destructive';
    if (isUrgent) return 'default';
    return 'outline';
  };

  const getStatusText = () => {
    if (isPast) return 'Completed';
    if (isToday) return 'Today!';
    if (exam.daysLeft === 1) return '1 day left';
    return `${exam.daysLeft} days left`;
  };

  return (
    <Card className={`border-2 ${isToday ? 'border-destructive' : isUrgent ? 'border-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{exam.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(Number(exam.date) / 1000000).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant={getBadgeVariant()} className="text-sm px-3 py-1">
            {getStatusText()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
