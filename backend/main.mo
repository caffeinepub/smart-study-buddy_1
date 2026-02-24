import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Char "mo:core/Char";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";

actor {
  public type Subject = {
    name : Text;
    studyTime : Nat; // in minutes
  };

  public type Note = {
    id : Nat;
    subject : Text;
    content : Text;
  };

  public type Flashcard = {
    id : Nat;
    question : Text;
    answer : Text;
  };

  public type Exam = {
    name : Text;
    date : Int;
  };

  public type StudySession = {
    subject : Text;
    duration : Nat;
    completed : Bool;
  };

  public type DayProgress = {
    date : Int;
    totalStudyTime : Nat;
    sessions : [StudySession];
  };

  module Subject {
    public func compareByName(subject1 : Subject, subject2 : Subject) : Order.Order {
      Text.compare(subject1.name, subject2.name);
    };
  };

  let subjects = List.empty<Subject>();
  let notes = Map.empty<Nat, Note>();
  let flashcards = Map.empty<Nat, Flashcard>();
  let exams = Map.empty<Nat, Exam>();
  let daysProgress = Map.empty<Int, DayProgress>();

  var nextNoteId = 0;
  var nextFlashcardId = 0;
  var nextExamId = 0;

  // Daily Timetable
  public shared ({ caller }) func addSubject(name : Text, studyTime : Nat) : async () {
    subjects.add({ name; studyTime });
  };

  public shared ({ caller }) func removeSubject(name : Text) : async () {
    let lowercaseName = toLowercase(name);
    let filteredSubjects = subjects.filter(
      func(s) {
        let lowercaseSubjectName = toLowercase(s.name);
        lowercaseSubjectName != lowercaseName;
      }
    );
    subjects.clear();
    for (subject in filteredSubjects.values()) {
      subjects.add(subject);
    };
  };

  public query ({ caller }) func getDailyTimetable() : async [Subject] {
    subjects.toArray().sort(Subject.compareByName);
  };

  // Notes Section
  public shared ({ caller }) func addNote(subject : Text, content : Text) : async Nat {
    let id = nextNoteId;
    nextNoteId += 1;
    notes.add(id, { id; subject; content });
    id;
  };

  // Flashcards Mode
  public shared ({ caller }) func createFlashcard(question : Text, answer : Text) : async Nat {
    let id = nextFlashcardId;
    nextFlashcardId += 1;
    flashcards.add(id, { id; question; answer });
    id;
  };

  public shared ({ caller }) func updateFlashcard(id : Nat, question : Text, answer : Text) : async () {
    if (not flashcards.containsKey(id)) {
      Runtime.trap("[updateFlashcard] - Flashcard not found");
    };
    flashcards.add(id, { id; question; answer });
  };

  public query ({ caller }) func getFlashcard(id : Nat) : async Flashcard {
    switch (flashcards.get(id)) {
      case (null) {
        Runtime.trap("[getFlashcard] - Flashcard not found");
      };
      case (?flashcard) { flashcard };
    };
  };

  public query ({ caller }) func getAllFlashcards() : async [Flashcard] {
    flashcards.values().toArray();
  };

  // Exam Countdown
  public shared ({ caller }) func addExam(name : Text, date : Int) : async Nat {
    let id = nextExamId;
    nextExamId += 1;
    exams.add(id, { name; date });
    id;
  };

  public query ({ caller }) func getDaysUntilExam(examId : Nat) : async ?Int {
    switch (exams.get(examId)) {
      case (null) { null };
      case (?exam) {
        let currentTime = Time.now();
        let daysRemaining = (exam.date - currentTime) / (1000 * 60 * 60 * 24);
        ?daysRemaining;
      };
    };
  };

  // Helper function to convert Text to lowercase
  func toLowercase(text : Text) : Text {
    text.map(
      func(char) {
        if (char >= 'A' and char <= 'Z') {
          Char.fromNat32(char.toNat32() + 32);
        } else {
          char;
        };
      }
    );
  };
};
