import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Subject {
    name: string;
    studyTime: bigint;
}
export interface Flashcard {
    id: bigint;
    question: string;
    answer: string;
}
export interface backendInterface {
    addExam(name: string, date: bigint): Promise<bigint>;
    addNote(subject: string, content: string): Promise<bigint>;
    addSubject(name: string, studyTime: bigint): Promise<void>;
    createFlashcard(question: string, answer: string): Promise<bigint>;
    getAllFlashcards(): Promise<Array<Flashcard>>;
    getDailyTimetable(): Promise<Array<Subject>>;
    getDaysUntilExam(examId: bigint): Promise<bigint | null>;
    getFlashcard(id: bigint): Promise<Flashcard>;
    removeSubject(name: string): Promise<void>;
    updateFlashcard(id: bigint, question: string, answer: string): Promise<void>;
}
