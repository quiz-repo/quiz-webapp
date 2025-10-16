import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { TestResult } from "./FirebaseDataService";
import { getStorage } from "firebase/storage";

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
export const storage = getStorage(app);

const ensureAuthenticated = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(true);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};
// const isAdmin = async (): Promise<boolean> => {
//   try {
//     const user = auth.currentUser;
//     if (!user) return false;
//     console.log(
//       "Logged in user email_",
//       user.email
//     );
//     return user.email === "admin@yopmail.com";
//   } catch (error) {
//     console.error("Error checking admin status:", error);
//     return false;
//   }
// };
const isAdmin = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (!user) {
        console.log("isAdmin: No user logged in");
        resolve(false);
        return;
      }

      console.log("isAdmin: Current user email:", user.email);

      // Option 1: check by email (if you only have one admin)
      if (user.email === "admin@yopmail.com") {
        resolve(true);
        return;
      }

      // Option 2: check by role from Firestore
      // const userDocRef = doc(db, "users", user.uid);
      // getDoc(userDocRef).then(docSnap => {
      //   if (docSnap.exists() && docSnap.data()?.role === "admin") {
      //     resolve(true);
      //   } else {
      //     resolve(false);
      //   }
      // });

      resolve(false);
    });
  });
};


async function getData() {
  try {
    console.log("getData: Starting to fetch tests data");
    
    const user = auth.currentUser;
    console.log("getData: Current user:", user?.uid);
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    console.log("getData: Attempting to fetch from tests collection");
    const querySnapshot = await getDocs(collection(db, "tests"));
    
    console.log("getData: Successfully fetched", querySnapshot.docs.length, "documents");
    
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    console.log("getData: Processed data:", data);
    return data;
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
}

async function getQuestions() {
  try {
    console.log("getQuestions: Starting to fetch questions data");
    
    const user = auth.currentUser;
    console.log("getQuestions: Current user:", user?.uid);
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    console.log("getQuestions: Attempting to fetch from questions collection");
    const querySnapshot = await getDocs(collection(db, "questions"));
    
    console.log("getQuestions: Successfully fetched", querySnapshot.docs.length, "documents");
    
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    console.log("getQuestions: Processed data:", data);
    return data;
  } catch (error) {
    console.error("Error getting questions:", error);
    throw error;
  }
}

async function addTestDocument(data: any): Promise<string> {
  try {
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to add test document");
    }

    const adminStatus = await isAdmin();
    if (!adminStatus) {
      throw new Error("User must be admin to add test document");
    }

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
      createdAt: data.createdAt,
    });

    console.log("Document written with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding test document:", error);
    throw error;
  }
}
async function getAllUsers(): Promise<any[]> {
  try {
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User must be authenticated");
    }

 

    console.log("getAllUsers: Fetching all users");
    const querySnapshot = await getDocs(collection(db, "users"));
    
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    console.log("getAllUsers: Successfully fetched", users.length, "users");
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
}
async function getUserTestResultsById(userId: string): Promise<TestResult[]> {
  try {
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User must be authenticated");
    }

    console.log("getUserTestResultsById: Fetching test results for user:", userId);
    const q = query(
      collection(db, "testResults"),
      where("userId", "==", userId),
      orderBy("completedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TestResult[];
    
    console.log("getUserTestResultsById: Successfully fetched", results.length, "results");
    return results;
  } catch (error) {
    console.error("Error getting user test results by ID:", error);
    return [];
  }
}
async function getAllTestResults(): Promise<TestResult[]> {
  try {
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User must be authenticated");
    }

    const adminStatus = await isAdmin();
    if (!adminStatus) {
      throw new Error("Access denied: Admin privileges required");
    }

    console.log("getAllTestResults: Fetching all test results");
    const querySnapshot = await getDocs(collection(db, "testResults"));
    
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TestResult[];
    
    console.log("getAllTestResults: Successfully fetched", results.length, "results");
    return results;
  } catch (error) {
    console.error("Error getting all test results:", error);
    return [];
  }
}

// async function getTotalUsers(): Promise<number> {
//   try {
//     const isAuthenticated = await ensureAuthenticated();
//     if (!isAuthenticated) {
//       throw new Error("User must be authenticated to get total users");
//     }

//     const adminStatus = await isAdmin();
//     if (!adminStatus) {
//       throw new Error("Access denied: Admin privileges required");
//     }
    
//     const querySnapshot = await getDocs(collection(db, "users"));
//     return querySnapshot.size;
//   } catch (error) {
//     console.error("Error getting total users:", error);
//     return 0;
//   }
// }

async function getTotalUsers(): Promise<number> {
  try {
    const authenticated = await ensureAuthenticated();
    if (!authenticated) {
      console.warn("getTotalUsers: User not authenticated");
      return 0;
    }

    const admin = await isAdmin();
    if (!admin) {
      console.warn("getTotalUsers: Access denied - admin required");
      return 0;
    }

    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.size;
  } catch (error) {
    console.error("getTotalUsers: Error fetching users", error);
    return 0;
  }
}


const fetchTestResult = async (resultId: string): Promise<TestResult> => {
  try {
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to fetch test results");
    }

    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found");
    }

    const docRef = doc(db, "testResults", resultId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Check if user is admin or owner of the test result
      const adminStatus = await isAdmin();
      if (!adminStatus && data.userId !== user.uid) {
        throw new Error("Unauthorized to access this test result");
      }

      return {
        id: docSnap.id,
        ...data,
      } as TestResult;
    } else {
      throw new Error("Test result not found");
    }
  } catch (error) {
    console.error("Error fetching test result:", error);
    throw error;
  }
};
const addTestResult = async (result: Omit<TestResult, 'id'>): Promise<string> => {
  try {
    const isAuthenticated = await ensureAuthenticated();
    if (!isAuthenticated) {
      throw new Error("User must be authenticated to save test results");
    }

    const user = auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Ensure the result belongs to the current user
    const resultWithUserId = {
      ...result,
      userId: user.uid,
    };

    const docRef = await addDoc(collection(db, "testResults"), resultWithUserId);
    console.log("Test result saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving test result:", error);
    throw error;
  }
};
const getUserTestResults = async (): Promise<TestResult[]> => {
  try {
    console.log("getUserTestResults: Starting to fetch test results");
    
    const user = auth.currentUser;
    console.log("getUserTestResults: Current user:", user?.uid);
    
    if (!user) {
      console.log("getUserTestResults: No authenticated user, returning empty array");
      return [];
    }

    console.log("getUserTestResults: Attempting to fetch user's test results");
    const q = query(
      collection(db, "testResults"),
      where("userId", "==", user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    console.log("getUserTestResults: Successfully fetched", querySnapshot.docs.length, "results");
    
    const results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TestResult[];
    
    console.log("getUserTestResults: Processed results:", results);
    return results;
  } catch (error) {
    console.error("Error getting user test results:", error);
    return [];
  }
};
const getTestAnalytics = async (testId: string) => {
  try {
    const adminStatus = await isAdmin();
  
    

    const q = query(
      collection(db, "testResults"),
      where("testId", "==", testId)
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => doc.data());
    
    return {
      totalAttempts: results.length,
      averageScore: results.length > 0 ? 
        results.reduce((acc, result) => acc + (result.score || 0), 0) / results.length : 0,
      highestScore: results.length > 0 ? 
        Math.max(...results.map(r => r.score || 0)) : 0,
      lowestScore: results.length > 0 ? 
        Math.min(...results.map(r => r.score || 0)) : 0,
      passRate: results.length > 0 ? 
        (results.filter(r => (r.score || 0) >= 60).length / results.length) * 100 : 0,
    };
  } catch (error) {
    console.error("Error getting test analytics:", error);
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
  addTestResult,
  getUserTestResults,
  getUserTestResultsById,
  getAllUsers,
  getAllTestResults,
  getTestAnalytics,
  ensureAuthenticated,
  isAdmin,
  createAdmin,
};