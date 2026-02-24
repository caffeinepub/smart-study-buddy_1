import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NoteCardProps {
  note: {
    id: bigint;
    subject: string;
    content: string;
  };
}

export default function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{note.subject}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-6 whitespace-pre-wrap">{note.content}</p>
      </CardContent>
    </Card>
  );
}
