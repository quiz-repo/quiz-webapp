// types.ts
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
  timeTaken: number;
  dateCompleted: string;
  userAnswers: UserAnswer[];
  totalQuestions: number;
  percentage: number;
  formattedTime?: string;
}
export interface ResultsManagementProps {
  users: User[];
  tests: Tests[];
  loading: boolean;
}
export interface Tests {
  id: string;
  name: string;        // <-- required
  description?: string;
}

export interface UserAnswer {
  questionId: string;
  attempt: any;
  answer?: any;
  correctAnswer?: any;
  userAnswers?: any;
}

export interface UserSummaryTestResult {
  testName: string;
  score: number;
  date: string;
  duration: string;
  status: "completed" | "in-progress"; // union type to match your component
}

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email: string;
  status: "active" | "inactive"; // union type
  joinDate: string;
  completedTests: number;
  totalTests: number;
  avgScore: number;
  createdAt?: any;
  testResults?: UserSummaryTestResult[];
  photoURL?: string;
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
