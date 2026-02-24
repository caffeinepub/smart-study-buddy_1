import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Flame, Target, StickyNote, MessageCircle } from 'lucide-react';
import { useStudyProgress } from '@/hooks/useStudyProgress';
import { useExams } from '@/hooks/useQueries';
import ExamCard from '@/components/ExamCard';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

export default function Dashboard() {
  const { streak, todayHours, todayGoal, progressPercentage } = useStudyProgress();
  const { data: exams = [], isLoading: examsLoading } = useExams();

  const upcomingExams = exams
    .filter((exam) => exam.daysLeft !== null && exam.daysLeft >= 0)
    .sort((a, b) => (a.daysLeft || 0) - (b.daysLeft || 0))
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-background p-8 md:p-12">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <img
            src="/assets/generated/study-buddy-mascot.dim_256x256.png"
            alt="Study Buddy Mascot"
            className="h-32 w-32 md:h-40 md:w-40"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome Back, Student! 📚</h1>
            <p className="text-lg text-muted-foreground">
              Ready to make today a productive study day? Let's achieve your goals together!
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{streak} days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it going! 🔥</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Study Time</CardTitle>
            <Clock className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground mt-1">of {todayGoal}h goal</p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Progress</CardTitle>
            <Target className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{progressPercentage}%</div>
            <Progress value={progressPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <BookOpen className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Stay prepared!</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Exams */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Upcoming Exams</CardTitle>
        </CardHeader>
        <CardContent>
          {examsLoading ? (
            <p className="text-muted-foreground">Loading exams...</p>
          ) : upcomingExams.length > 0 ? (
            <div className="space-y-4">
              {upcomingExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No upcoming exams. Add one to start tracking!</p>
              <Link to="/planner">
                <Button>Add Exam</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link to="/timer">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Start Focus Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Begin a 25-minute Pomodoro session</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/notes">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StickyNote className="h-5 w-5" />
                Quick Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Jot down important study notes</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/ai-assistant">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Ask AI Helper
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Get help understanding topics</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
