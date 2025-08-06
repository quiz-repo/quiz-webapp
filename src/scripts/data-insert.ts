

import { testdata } from "@/app/components/tests/common/TestData";
import { db } from "@/lib/Firebase";
import { doc, updateDoc, collection, getDocs, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Types
interface Question {
  id: string;
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

//  Get a single test document by ID
async function getDocByFirebase(id: string): Promise<TestDetail | null> {
  const docRef = doc(db, "tests", id);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return {
      id: snapshot.id,
      ...snapshot.data(),
    } as TestDetail;
  }
  return null;
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
async function dataInserts(dummyData: TestDetail[]) {
  try {
    await Promise.all(
      dummyData.map(async (obj) => {
        const testDetail = await getDocByFirebase(obj.id);

        if (!testDetail || typeof testDetail !== "object") {
          console.log(`Invalid or missing document for test ID: ${obj.id}`);
          return;
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

        const testRef = doc(db, "tests", obj.id);
        await updateDoc(testRef, {
          questions: mergedQuestions,
        });

        console.log(` Questions updated for test ID: ${obj.id}`);
      })
    );
  } catch (error) {
    console.error(" Error in dataInserts:", error);
  }
}


const dummyData:any = testdata(); 
dataInserts(dummyData);
