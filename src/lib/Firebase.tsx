import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { TestResult } from "./FirebaseDataService";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export const storage = getStorage(app);

// export const functions = getFunctions(app, "asia-south1");

// -----------------------------------
// AUTH HELPERS
// -----------------------------------

const ensureAuthenticated = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (auth.currentUser) return resolve(true);

    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      resolve(!!user);
    });
  });
};

const isAdmin = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();

      if (!user) return resolve(false);

      const token = await user.getIdToken();

      const res = await fetch("/api/check-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      resolve(data.isAdmin);
    });
  });
};

// -----------------------------------
// FETCH TEST LIST
// -----------------------------------

async function getData() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const snap = await getDocs(collection(db, "tests"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// -----------------------------------
// FETCH QUESTIONS COLLECTION
// -----------------------------------

async function getQuestions() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const snap = await getDocs(collection(db, "questions"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// -----------------------------------
// ADD TEST DOCUMENT (SECURE)
// -----------------------------------

async function addTestDocument(data: any): Promise<string> {
  const isAuthenticated = await ensureAuthenticated();
  if (!isAuthenticated) throw new Error("User must be authenticated");

  const adminStatus = await isAdmin();
  if (!adminStatus) throw new Error("User must be admin");

  // ------------------------------
  // 1️⃣ Extract correct answers
  // ------------------------------
  const answerKey: Record<string, number> = {};
  const questionsForStudent = data.questions.map((q: any) => {
    answerKey[q.id] = q.correctAnswer;

    return {
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer, // Keep this for Admin Panel visibility
      difficulty: q.difficulty,
      type: q.type
    };
  });

  // ------------------------------
  // 2️⃣ Save test WITHOUT answers
  // ------------------------------
  const docRef = await addDoc(collection(db, "tests"), {
    title: data.title,
    subject: data.subject,
    duration: data.duration,
    questions: questionsForStudent,
    description: data.description,
    instructions: data.instructions,
    created: data.created,
    createdAt: data.createdAt,
    status: data.status,
    difficulty: data.difficulty,
  });

  console.log("Test saved with ID:", docRef.id);

  await setDoc(doc(db, "answers", docRef.id), answerKey);


  console.log("Answer key stored securely");

  return docRef.id;
}

// export const result = collection(db, "answers");
export const getResults = async () => {
  const snapshot = await getDocs(collection(db, "answers"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getAdmins = async () => {
  const snapshot = await getDocs(collection(db, "admin"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
async function getAllUsers(): Promise<any[]> {
  const isAuthenticated = await ensureAuthenticated();
  if (!isAuthenticated) throw new Error("User must be authenticated");

  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

async function getUserTestResultsById(userId: string): Promise<TestResult[]> {
  const isAuthenticated = await ensureAuthenticated();
  if (!isAuthenticated) throw new Error("User must be authenticated");

  const q = query(
    collection(db, "testResults"),
    where("userId", "==", userId),
    orderBy("completedAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as TestResult[];
}

async function getAllTestResults(): Promise<TestResult[]> {
  const isAuthenticated = await ensureAuthenticated();
  if (!isAuthenticated) throw new Error("User must be authenticated");

  const adminStatus = await isAdmin();
  if (!adminStatus) throw new Error("Admin privileges required");

  const snap = await getDocs(collection(db, "testResults"));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as TestResult[];
}

async function getTotalUsers(): Promise<number> {
  const isAuthenticated = await ensureAuthenticated();
  if (!isAuthenticated) return 0;

  const isAdminUser = await isAdmin();
  if (!isAdminUser) return 0;

  const snap = await getDocs(collection(db, "users"));
  return snap.size;
}

const fetchTestResult = async (resultId: string): Promise<TestResult> => {
  const isAuthenticated = await ensureAuthenticated();
  if (!isAuthenticated) throw new Error("User must be authenticated");

  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user found");

  const docRef = doc(db, "testResults", resultId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) throw new Error("Test result not found");

  const data = docSnap.data();

  const adminStatus = await isAdmin();
  if (!adminStatus && data.userId !== user.uid)
    throw new Error("Unauthorized access");

  return { id: docSnap.id, ...data } as TestResult;
};

const addTestResult = async (result: Omit<TestResult, "id">): Promise<string> => {
  const isAuthenticated = await ensureAuthenticated();
  if (!isAuthenticated) throw new Error("User must be authenticated");

  const user = auth.currentUser;
  if (!user) throw new Error("User missing");

  const resultWithUserId = { ...result, userId: user.uid };

  const docRef = await addDoc(collection(db, "testResults"), resultWithUserId);
  return docRef.id;
};

const getUserTestResults = async (): Promise<TestResult[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "testResults"),
    where("userId", "==", user.uid)
  );

  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as TestResult[];
};

const getTestAnalytics = async (testId: string) => {
  const adminStatus = await isAdmin();
  if (!adminStatus) throw new Error("Admin required");

  const q = query(collection(db, "testResults"), where("testId", "==", testId));
  const snap = await getDocs(q);
  const results = snap.docs.map((doc) => doc.data());

  return {
    totalAttempts: results.length,
    averageScore:
      results.length > 0
        ? results.reduce((a, r) => a + (r.score || 0), 0) / results.length
        : 0,
    highestScore: results.length > 0 ? Math.max(...results.map((r) => r.score || 0)) : 0,
    lowestScore: results.length > 0 ? Math.min(...results.map((r) => r.score || 0)) : 0,
    passRate:
      results.length > 0
        ? (results.filter((r) => (r.score || 0) >= 60).length / results.length) * 100
        : 0,
  };
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
  addTestResult,
  getUserTestResults,
  getUserTestResultsById,
  getAllUsers,
  getAllTestResults,
  getTestAnalytics,
  ensureAuthenticated,
  isAdmin,
};
