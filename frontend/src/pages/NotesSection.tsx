import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search } from 'lucide-react';
import { useNotes, useAddNote } from '@/hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NoteCard from '@/components/NoteCard';

export default function NotesSection() {
  const { data: notes = [], isLoading } = useNotes();
  const addNote = useAddNote();

  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddNote = () => {
    if (subject.trim() && content.trim()) {
      addNote.mutate(
        { subject: subject.trim(), content: content.trim() },
        {
          onSuccess: () => {
            setSubject('');
            setContent('');
            setDialogOpen(false);
          },
        }
      );
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedNotes = filteredNotes.reduce((acc, note) => {
    if (!acc[note.subject]) {
      acc[note.subject] = [];
    }
    acc[note.subject].push(note);
    return acc;
  }, {} as Record<string, typeof notes>);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Study Notes</h1>
          <p className="text-muted-foreground">Keep all your important notes organized</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="note-subject">Subject</Label>
                <Input
                  id="note-subject"
                  placeholder="e.g., Mathematics, Science, History"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-content">Note Content</Label>
                <Textarea
                  id="note-content"
                  placeholder="Write your notes here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>
              <Button onClick={handleAddNote} disabled={addNote.isPending} className="w-full" size="lg">
                {addNote.isPending ? 'Saving...' : 'Save Note'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Notes Display */}
      {isLoading ? (
        <p className="text-muted-foreground">Loading notes...</p>
      ) : filteredNotes.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedNotes).map(([subjectName, subjectNotes]) => (
            <div key={subjectName}>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                  {subjectName.charAt(0)}
                </span>
                {subjectName}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {subjectNotes.map((note) => (
                  <NoteCard key={Number(note.id)} note={note} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
