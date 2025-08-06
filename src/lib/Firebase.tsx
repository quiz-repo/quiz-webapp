
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { TestResult } from "./FirebaseDataServise";

const firebaseConfig = {
  apiKey: "AIzaSyDpnBusw0FWGY0qqQd-rtuljkC_2XlEH10",
  authDomain: "newproject-f0d20.firebaseapp.com",
  projectId: "newproject-f0d20",
  storageBucket: "newproject-f0d20.appspot.com",
  messagingSenderId: "863958675589",
  appId: "1:863958675589:web:4f6f20e0ea62c8003c39ec",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function getData() {
  try {
    const querySnapshot = await getDocs(collection(db, "tests"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
}

async function getQuestions() {
  try {
    const querySnapshot = await getDocs(collection(db, "questions"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting questions:", error);
    throw error;
  }
}

async function addTestDocument(data: any): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "tests"), {
      title: data.title,
      subject: data.subject,
      duration: data.duration,
      questions: data.questions,
      difficulty: data.difficulty,
      status: data.status,
      description: data.description,
      instructions: data.instructions,
      created: data.created,
    });

    console.log("Document written with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding test document:", error);
    throw error;
  }
}

async function getTotalUsers(): Promise<number> {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting total users:", error);
    return 0;
  }
}

const fetchTestResult = async (resultId: string): Promise<TestResult> => {
  try {
    const docRef = doc(db, "testResults", resultId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as TestResult;
    } else {
      throw new Error("Test result not found");
    }
  } catch (error) {
    console.error("Error fetching test result:", error);
    throw error;
  }
};


export {
  auth,
  db,
  signOut, 
  getData as getDocByFirebase,
  addTestDocument as setDocByFirebase,
  getQuestions,
  getTotalUsers,
  fetchTestResult,
};

