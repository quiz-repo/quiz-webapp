// // lib/firebaseDataService.ts
// import { 
//   collection, 
//   addDoc, 
//   getDocs, 
//   doc, 
//   updateDoc, 
//   deleteDoc, 
//   query, 
//   where,
//   onSnapshot,
//   orderBy,
//   Timestamp 
// } from "firebase/firestore";
// import { db } from "@/lib/Firebase";

// export interface Test {
//   id?: string;
//   title: string;
//   description?: string;
//   questions: number;
//   created: string;
//   status: "active" | "draft";
//   duration: number; // in minutes
//   createdAt?: Timestamp;
// }

// export interface Question {
//   id?: string;
//   testId: string;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   type: "multiple-choice";
//   createdAt?: Timestamp;
// }

// export interface TestResult {
//   id?: string;
//   score: number;
//   timeTaken: string;
//   testId: string;
//   dateCompleted: string;
//   userId?: string;
//   createdAt?: Timestamp;
// }

// class FirebaseDataService {
//   private static instance: FirebaseDataService;
  
//   private constructor() {}
  
//   static getInstance(): FirebaseDataService {
//     if (!FirebaseDataService.instance) {
//       FirebaseDataService.instance = new FirebaseDataService();
//     }
//     return FirebaseDataService.instance;
//   }

//   // Test Management
//   async getAllTests(): Promise<Test[]> {
//     try {
//       const querySnapshot = await getDocs(
//         query(collection(db, "tests"), orderBy("createdAt", "desc"))
//       );
//       return querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Test[];
//     } catch (error) {
//       console.error("Error fetching tests:", error);
//       return [];
//     }
//   }

//   async addTest(test: Omit<Test, 'id' | 'questions' | 'createdAt'>): Promise<Test> {
//     try {
//       const newTest = {
//         ...test,
//         questions: 0,
//         createdAt: Timestamp.now(),
//       };
      
//       const docRef = await addDoc(collection(db, "tests"), newTest);
      
//       return {
//         id: docRef.id,
//         ...newTest,
//       } as Test;
//     } catch (error) {
//       console.error("Error adding test:", error);
//       throw error;
//     }
//   }

//   async updateTest(testId: string, updates: Partial<Test>): Promise<void> {
//     try {
//       const testRef = doc(db, "tests", testId);
//       await updateDoc(testRef, updates);
//     } catch (error) {
//       console.error("Error updating test:", error);
//       throw error;
//     }
//   }

//   async deleteTest(testId: string): Promise<void> {
//     try {
//       // Delete all questions for this test first
//       const questionsQuery = query(
//         collection(db, "questions"), 
//         where("testId", "==", testId)
//       );
//       const questionsSnapshot = await getDocs(questionsQuery);
      
//       const deletePromises = questionsSnapshot.docs.map(questionDoc => 
//         deleteDoc(doc(db, "questions", questionDoc.id))
//       );
//       await Promise.all(deletePromises);
      
//       // Then delete the test
//       await deleteDoc(doc(db, "tests", testId));
//     } catch (error) {
//       console.error("Error deleting test:", error);
//       throw error;
//     }
//   }

//   // Question Management
//   async getAllQuestions(): Promise<Question[]> {
//     try {
//       const querySnapshot = await getDocs(
//         query(collection(db, "questions"), orderBy("createdAt", "asc"))
//       );
//       return querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Question[];
//     } catch (error) {
//       console.error("Error fetching questions:", error);
//       return [];
//     }
//   }

//   async getQuestionsByTestId(testId: string): Promise<Question[]> {
//     try {
//       const q = query(
//         collection(db, "questions"), 
//         where("testId", "==", testId),
//         orderBy("createdAt", "asc")
//       );
//       const querySnapshot = await getDocs(q);
//       return querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Question[];
//     } catch (error) {
//       console.error("Error fetching questions by test ID:", error);
//       return [];
//     }
//   }

//   async addQuestion(question: Omit<Question, 'id' | 'createdAt'>): Promise<Question> {
//     try {
//       const newQuestion = {
//         ...question,
//         createdAt: Timestamp.now(),
//       };
      
//       const docRef = await addDoc(collection(db, "questions"), newQuestion);
      
//       // Update test question count
//       const testRef = doc(db, "tests", question.testId);
//       const questions = await this.getQuestionsByTestId(question.testId);
//       await updateDoc(testRef, {
//         questions: questions.length + 1
//       });
      
//       return {
//         id: docRef.id,
//         ...newQuestion,
//       } as Question;
//     } catch (error) {
//       console.error("Error adding question:", error);
//       throw error;
//     }
//   }

//   async updateQuestion(questionId: string, updates: Partial<Question>): Promise<void> {
//     try {
//       const questionRef = doc(db, "questions", questionId);
//       await updateDoc(questionRef, updates);
//     } catch (error) {
//       console.error("Error updating question:", error);
//       throw error;
//     }
//   }

//   async deleteQuestion(questionId: string, testId: string): Promise<void> {
//     try {
//       await deleteDoc(doc(db, "questions", questionId));
      
//       // Update test question count
//       const questions = await this.getQuestionsByTestId(testId);
//       const testRef = doc(db, "tests", testId);
//       await updateDoc(testRef, {
//         questions: Math.max(0, questions.length - 1)
//       });
//     } catch (error) {
//       console.error("Error deleting question:", error);
//       throw error;
//     }
//   }

//   // Test Results Management
//   async getAllTestResults(): Promise<TestResult[]> {
//     try {
//       const querySnapshot = await getDocs(
//         query(collection(db, "testResults"), orderBy("createdAt", "desc"))
//       );
//       return querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as TestResult[];
//     } catch (error) {
//       console.error("Error fetching test results:", error);
//       return [];
//     }
//   }

//   async saveTestResult(result: Omit<TestResult, 'id' | 'createdAt'>): Promise<TestResult> {
//     try {
//       const newResult = {
//         ...result,
//         createdAt: Timestamp.now(),
//       };
      
//       const docRef = await addDoc(collection(db, "testResults"), newResult);
      
//       return {
//         id: docRef.id,
//         ...newResult,
//       } as TestResult;
//     } catch (error) {
//       console.error("Error saving test result:", error);
//       throw error;
//     }
//   }

//   // Real-time listeners
//   onTestsChange(callback: (tests: Test[]) => void): () => void {
//     const q = query(collection(db, "tests"), orderBy("createdAt", "desc"));
//     return onSnapshot(q, (querySnapshot) => {
//       const tests = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Test[];
//       callback(tests);
//     });
//   }

//   onQuestionsChange(callback: (questions: Question[]) => void): () => void {
//     const q = query(collection(db, "questions"), orderBy("createdAt", "asc"));
//     return onSnapshot(q, (querySnapshot) => {
//       const questions = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Question[];
//       callback(questions);
//     });
//   }

//   onQuestionsByTestIdChange(testId: string, callback: (questions: Question[]) => void): () => void {
//     const q = query(
//       collection(db, "questions"), 
//       where("testId", "==", testId),
//       orderBy("createdAt", "asc")
//     );
//     return onSnapshot(q, (querySnapshot) => {
//       const questions = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as Question[];
//       callback(questions);
//     });
//   }

//   // Utility methods
//   // async getActiveTests(): Promise<Test[]> {
//   //   try {
//   //     const q = query(
//   //       collection(db, "tests"), 
//   //       where("status", "==", "active"),
//   //       orderBy("createdAt", "desc")
//   //     );
//   //     const querySnapshot = await getDocs(q);
//   //     return querySnapshot.docs
//   //       .map((doc) => ({
//   //         id: doc.id,
//   //         ...doc.data(),
//   //       })) as Test[]
//   //       .filter(test => test.questions > 0); 
//   //   } catch (error) {
//   //     console.error("Error fetching active tests:", error);
//   //     return [];
//   //   }
//   // }

//   async getActiveTests(): Promise<Test[]> {
//   try {
//     const q = query(
//       collection(db, "tests"), 
//       where("status", "==", "active"),
//       orderBy("createdAt", "desc")
//     );

//     const querySnapshot = await getDocs(q);

//     const tests = querySnapshot.docs
//       .map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }))
//       .filter((test: any) => test.questions && test.questions.length > 0) as Test[];

//     return tests;
//   } catch (error) {
//     console.error("Error fetching active tests:", error);
//     return [];
//   }
// }

//   async getQuestionsForDashboard(): Promise<Record<string, Question[]>> {
//     try {
//       const questions = await this.getAllQuestions();
//       const grouped: Record<string, Question[]> = {};
      
//       questions.forEach(question => {
//         if (!grouped[question.testId]) {
//           grouped[question.testId] = [];
//         }
//         grouped[question.testId].push(question);
//       });
      
//       return grouped;
//     } catch (error) {
//       console.error("Error grouping questions:", error);
//       return {};
//     }
//   }
// }

// export const firebaseDataService = FirebaseDataService.getInstance();

// lib/FirebaseDataService.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  query, 
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  limit,
  startAfter,
  writeBatch
} from "firebase/firestore";
import { db } from "@/lib/Firebase";

export interface Test {
  id?: string;
  title: string;
  description?: string;
  questions: number;
  created: string;
  status: "active" | "draft";
  duration: number; // in minutes
  createdAt?: Timestamp;
}

export interface Question {
  id?: string;
  testId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  type: "multiple-choice";
  createdAt?: Timestamp;
}

export interface TestResult {
  id?: string;
  score: number;
  timeTaken: string;
  testId: string;
  dateCompleted: string;
  userId?: string;
  createdAt?: Timestamp;
}

class FirebaseDataService {
  private static instance: FirebaseDataService;
  private constructor() {}
  
  static getInstance(): FirebaseDataService {
    if (!FirebaseDataService.instance) {
      FirebaseDataService.instance = new FirebaseDataService();
    }
    return FirebaseDataService.instance;
  }
  async getAllTests(lastDoc?: any, pageSize: number = 10): Promise<Test[]> {
    try {
      let q = query(
        collection(db, "tests"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );
      if (lastDoc) q = query(q, startAfter(lastDoc));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Test[];
    } catch (error) {
      console.error(" Error fetching tests:", error);
      return [];
    }
  }
  async addTest(test: Omit<Test, "id" | "questions" | "createdAt">): Promise<Test> {
    try {
      const newTest = {
        ...test,
        questions: 0,
        createdAt: Timestamp.now(),
      };
      const docRef = await addDoc(collection(db, "tests"), newTest);
      return { id: docRef.id, ...newTest };
    } catch (error) {
      console.error(" Error adding test:", error);
      throw error;
    }
  }
  async updateTest(testId: string, updates: Partial<Test>): Promise<void> {
    try {
      const testRef = doc(db, "tests", testId);
      await updateDoc(testRef, updates);
    } catch (error) {
      console.error(` Error updating test ${testId}:`, error);
      throw error;
    }
  }
  async deleteTest(testId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      const questionsQuery = query(
        collection(db, "questions"), 
        where("testId", "==", testId)
      );
      const questionsSnapshot = await getDocs(questionsQuery);
      questionsSnapshot.docs.forEach((qDoc) => {
        batch.delete(doc(db, "questions", qDoc.id));
      });
      batch.delete(doc(db, "tests", testId));

      await batch.commit();
    } catch (error) {
      console.error(` Error deleting test ${testId}:`, error);
      throw error;
    }
  }
  async getAllQuestions(lastDoc?: any, pageSize: number = 20): Promise<Question[]> {
    try {
      let q = query(
        collection(db, "questions"),
        orderBy("createdAt", "asc"),
        limit(pageSize)
      );
      if (lastDoc) q = query(q, startAfter(lastDoc));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Question[];
    } catch (error) {
      console.error(" Error fetching questions:", error);
      return [];
    }
  }
  async getActiveTests(): Promise<Test[]> {
    try {
      const q = query(
        collection(db, "tests"), 
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((test: any) => test.questions > 0) as Test[];
    } catch (error) {
      console.error(" Error fetching active tests:", error);
      return [];
    }
  }
}

export const firebaseDataService = FirebaseDataService.getInstance();
