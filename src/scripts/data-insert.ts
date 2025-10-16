import { testdata } from "@/app/components/tests/common/TestData";
import { auth, db } from "@/lib/Firebase";
import { 
  doc, 
  collection, 
  getDocs, 
  getDoc, 
  writeBatch
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

interface Question {
  id: string | number; 
  testId?: string; 
  question: string;
  options: string[];
  correctAnswer: number;
  type: string;
  [key: string]: any;
}

interface TestDetail {
  id: string;
  questions: Question[];
  [key: string]: any;
}
const waitForAuth = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      console.log("User already authenticated:", auth.currentUser.uid);
      resolve(true);
      return;
    }
    
    console.log("Waiting for authentication...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        console.log("User authenticated:", user.uid);
        resolve(true);
      } else {
        console.log("No user authenticated");
        resolve(false);
      }
    });
  });
};

async function getDocByFirebase(id: string): Promise<TestDetail | null> {
  try {
    const docRef = doc(db, "tests", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as TestDetail;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document ${id}:`, error);
    throw error;
  }
}

async function getData(): Promise<TestDetail[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "tests"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TestDetail[];
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
}

async function dataInserts(dummyData: TestDetail[]): Promise<void> {
  try {
   
    console.log("Checking authentication...");
    const isAuthenticated = await waitForAuth();
    
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to insert data. Please log in first.");
    }
    
    
    const batch = writeBatch(db);
    let operationCount = 0;

    for (const obj of dummyData) {
    
      
      const testDetail = await getDocByFirebase(obj.id);

      if (!testDetail) {
       
        continue;
      }

      const existingQuestions: Question[] = Array.isArray(testDetail.questions)
        ? testDetail.questions
        : [];


      const newQuestions: Question[] = obj.questions.map((q) => ({
        ...q,
        id: uuidv4(),
        testId: obj.id,
      }));

      const mergedQuestions: Question[] = [
        ...existingQuestions,
        ...newQuestions.filter(
          (newQ) =>
            !existingQuestions.some(
              (existingQ) => existingQ.question === newQ.question
            )
        ),
      ];

      if (mergedQuestions.length > existingQuestions.length) {
        const testRef = doc(db, "tests", obj.id);
        batch.update(testRef, { questions: mergedQuestions });
        operationCount++;
        console.log(`Queued update for test ${obj.id} with ${mergedQuestions.length} total questions`);
      } else {
        console.log(`  No new questions to add for test ${obj.id}`);
      }
    }

    if (operationCount > 0) {

      await batch.commit();
 
    } else {
 
    }
    
  } catch (error: any) {
    console.error(" Error in dataInserts:", error);
    // Provide more specific error information
    if (error.code === 'permission-denied') {
      console.error("\ PERMISSION DENIED SOLUTION");
    
      console.error(`match /tests/{document} {
  allow read, write: if request.auth != null;
}`);
    } else if (error.code === 'not-found') {
      console.error("\n📄 DOCUMENT NOT FOUND:");
      console.error("Make sure the test documents exist in your Firestore database");
    }
    
    throw error;
  }
}

// Enhanced execution function
async function executeDataInsert() {
  try {
    console.log("Starting data insertion process...");
    setTimeout(async () => {
      try {
        const dummyData: TestDetail[] = testdata();
        console.log(`📊 Processing ${dummyData.length} test documents...`);
        
        if (dummyData.length === 0) {
          console.warn("  No test data ");
          return;
        }
        
        await dataInserts(dummyData);
        console.log(" Data insertion completed successfully!");
        
      } catch (error: any) {
        console.error(" Final error:", error);
        
        if (error.code === 'permission-denied') {
          console.error(" QUICK FIX:");
     
        }
      }
    }, 2000); 
    
  } catch (error) {
    console.error("Setup error:", error);
  }
}
export { executeDataInsert, dataInserts, waitForAuth };
if (typeof window !== 'undefined') {
  executeDataInsert();
}