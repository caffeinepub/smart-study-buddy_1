import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { Progress } from '@/components/ui/progress';

export default function PomodoroTimer() {
  const { minutes, seconds, isRunning, isBreak, sessionCount, start, pause, reset, progress } = useTimer();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pomodoro Timer</h1>
        <p className="text-muted-foreground">Stay focused with 25-minute study sessions</p>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {isBreak ? '☕ Break Time!' : '📚 Focus Time'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Timer Display */}
          <div className="text-center">
            <div className="text-8xl font-bold tabular-nums mb-4">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button onClick={start} size="lg" className="gap-2 text-lg px-8 py-6">
                <Play className="h-6 w-6" />
                Start
              </Button>
            ) : (
              <Button onClick={pause} size="lg" variant="secondary" className="gap-2 text-lg px-8 py-6">
                <Pause className="h-6 w-6" />
                Pause
              </Button>
            )}
            <Button onClick={reset} size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
              <RotateCcw className="h-6 w-6" />
              Reset
            </Button>
          </div>

          {/* Session Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Sessions completed today: {sessionCount}</p>
            <p className="text-sm text-muted-foreground">
              {isBreak ? 'Take a short break and relax!' : 'Focus on your studies without distractions'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Pomodoro Tips 💡</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Work for 25 minutes without any distractions</li>
            <li>• Take a 5-minute break after each session</li>
            <li>• After 4 sessions, take a longer 15-30 minute break</li>
            <li>• Turn off notifications during focus time</li>
            <li>• Use breaks to stretch, hydrate, or rest your eyes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
