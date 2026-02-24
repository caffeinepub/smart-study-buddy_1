import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Subject, Flashcard } from '../backend';

// Subjects
export function useSubjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDailyTimetable();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddSubject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, studyTime }: { name: string; studyTime: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addSubject(name, BigInt(studyTime));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}

export function useRemoveSubject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.removeSubject(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}

// Notes
export function useNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<{ id: bigint; subject: string; content: string }>>({
    queryKey: ['notes'],
    queryFn: async () => {
      if (!actor) return [];
      // Notes are stored but not retrieved in backend, using localStorage as fallback
      const stored = localStorage.getItem('study-notes');
      return stored ? JSON.parse(stored, (key, value) => {
        if (key === 'id' && typeof value === 'string') return BigInt(value);
        return value;
      }) : [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subject, content }: { subject: string; content: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      const id = await actor.addNote(subject, content);
      
      // Also store in localStorage for retrieval
      const stored = localStorage.getItem('study-notes');
      const notes = stored ? JSON.parse(stored, (key, value) => {
        if (key === 'id' && typeof value === 'string') return BigInt(value);
        return value;
      }) : [];
      notes.push({ id, subject, content });
      localStorage.setItem('study-notes', JSON.stringify(notes, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}

// Flashcards
export function useFlashcards() {
  const { actor, isFetching } = useActor();

  return useQuery<Flashcard[]>({
    queryKey: ['flashcards'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFlashcards();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddFlashcard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ question, answer }: { question: string; answer: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createFlashcard(question, answer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });
}

// Exams
export function useExams() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<{ id: bigint; name: string; date: bigint; daysLeft: number | null }>>({
    queryKey: ['exams'],
    queryFn: async () => {
      if (!actor) return [];
      
      // Exams are stored but not fully retrieved in backend, using localStorage
      const stored = localStorage.getItem('study-exams');
      const exams = stored ? JSON.parse(stored, (key, value) => {
        if ((key === 'id' || key === 'date') && typeof value === 'string') return BigInt(value);
        return value;
      }) : [];
      
      // Calculate days left for each exam
      const now = Date.now() * 1000000; // Convert to nanoseconds
      return exams.map((exam: any) => {
        const daysLeft = Math.floor((Number(exam.date) - now) / (1000000 * 1000 * 60 * 60 * 24));
        return { ...exam, daysLeft };
      });
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddExam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, date }: { name: string; date: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      const id = await actor.addExam(name, date);
      
      // Also store in localStorage for retrieval
      const stored = localStorage.getItem('study-exams');
      const exams = stored ? JSON.parse(stored, (key, value) => {
        if ((key === 'id' || key === 'date') && typeof value === 'string') return BigInt(value);
        return value;
      }) : [];
      exams.push({ id, name, date });
      localStorage.setItem('study-exams', JSON.stringify(exams, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}
