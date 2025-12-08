
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
