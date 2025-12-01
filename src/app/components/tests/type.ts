
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  [key: string]: any;
}
export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  subject: string;
  instructions?: string[]; 
   totalQuestions?: number;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
}

export interface TestResult {
  id?: string;
  testId: string;
  userId: string;
  score: number;
  timeTaken: string;
  dateCompleted: string;
  userAnswers: UserAnswer[];

  totalQuestions: number;
  percentage: number;
}
export interface UserAnswer {
  questionId: string;
  attempt: any;
  answer: any;
  correctAnswer: any;
  userAnswers: any;
  
}

export interface FirebaseTestResult {
  testId: string;
  userId: string;
  score: number;
  timeTaken: string;
  dateCompleted: string;
  userAnswers: number[];
  totalQuestions: number;
  percentage: number;
  createdAt: any;
}
