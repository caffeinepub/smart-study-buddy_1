import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { useSubjects, useAddSubject, useRemoveSubject, useExams, useAddExam } from '@/hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ExamCard from '@/components/ExamCard';

export default function StudyPlanner() {
  const { data: subjects = [], isLoading } = useSubjects();
  const addSubject = useAddSubject();
  const removeSubject = useRemoveSubject();
  const { data: exams = [] } = useExams();
  const addExam = useAddExam();

  const [subjectName, setSubjectName] = useState('');
  const [studyTime, setStudyTime] = useState('');
  const [examName, setExamName] = useState('');
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [examDialogOpen, setExamDialogOpen] = useState(false);

  const handleAddSubject = () => {
    if (subjectName.trim() && studyTime) {
      addSubject.mutate(
        { name: subjectName.trim(), studyTime: parseInt(studyTime) },
        {
          onSuccess: () => {
            setSubjectName('');
            setStudyTime('');
            setDialogOpen(false);
          },
        }
      );
    }
  };

  const handleRemoveSubject = (name: string) => {
    removeSubject.mutate(name);
  };

  const handleAddExam = () => {
    if (examName.trim() && examDate) {
      const dateTimestamp = new Date(examDate).getTime() * 1000000; // Convert to nanoseconds
      addExam.mutate(
        { name: `${examName} (${examSubject || 'General'})`, date: BigInt(dateTimestamp) },
        {
          onSuccess: () => {
            setExamName('');
            setExamSubject('');
            setExamDate('');
            setExamDialogOpen(false);
          },
        }
      );
    }
  };

  const totalStudyTime = subjects.reduce((acc, subject) => acc + Number(subject.studyTime), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Study Planner</h1>
        <p className="text-muted-foreground">Organize your subjects and track upcoming exams</p>
      </div>

      {/* Daily Timetable */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Daily Timetable</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Total study time: {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-name">Subject Name</Label>
                  <Input
                    id="subject-name"
                    placeholder="e.g., Mathematics, Science, English"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="study-time">Study Time (minutes)</Label>
                  <Input
                    id="study-time"
                    type="number"
                    placeholder="e.g., 60"
                    value={studyTime}
                    onChange={(e) => setStudyTime(e.target.value)}
                    min="1"
                  />
                </div>
                <Button onClick={handleAddSubject} disabled={addSubject.isPending} className="w-full" size="lg">
                  {addSubject.isPending ? 'Adding...' : 'Add Subject'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading subjects...</p>
          ) : subjects.length > 0 ? (
            <div className="space-y-3">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border-2 bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl">{subject.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {Math.floor(Number(subject.studyTime) / 60)}h {Number(subject.studyTime) % 60}m per day
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSubject(subject.name)}
                    disabled={removeSubject.isPending}
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <img
                src="/assets/generated/subject-icons.dim_512x512.png"
                alt="Subjects"
                className="h-32 w-32 mx-auto mb-4 opacity-50"
              />
              <p className="text-muted-foreground mb-4">No subjects added yet. Start by adding your first subject!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exam Countdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Exam Countdown</CardTitle>
          <Dialog open={examDialogOpen} onOpenChange={setExamDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Calendar className="h-5 w-5" />
                Add Exam
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Exam</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="exam-name">Exam Name</Label>
                  <Input
                    id="exam-name"
                    placeholder="e.g., Mid-term, Final Exam"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exam-subject">Subject (Optional)</Label>
                  <Input
                    id="exam-subject"
                    placeholder="e.g., Mathematics"
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exam-date">Exam Date</Label>
                  <Input
                    id="exam-date"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddExam} disabled={addExam.isPending} className="w-full" size="lg">
                  {addExam.isPending ? 'Adding...' : 'Add Exam'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {exams.length > 0 ? (
            <div className="space-y-4">
              {exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-4">No exams scheduled. Add your first exam to start tracking!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
