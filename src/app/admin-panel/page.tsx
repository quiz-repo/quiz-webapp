"use client";
import React, { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import Papa from "papaparse";

import {

  FileText,
  Award,
  TrendingUp,
  FileQuestion,
  Users,
} from "lucide-react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  arrayUnion,
  getDoc,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  db,
  setDocByFirebase,
  auth,
  signOut,
  getAllUsers,
  getUserTestResultsById,
  getTestAnalytics,
  storage,
} from "@/lib/Firebase";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import StatsCards from "@/components/StatsCards";
import RecentTests from "@/components/RecentTests";
import PerformanceOverview from "@/components/PerformanceOverview";
import SystemHealth from "@/components/SystemHealth";
import TestManagement from "../components/tests/TestManagement";
import UserManagement from "../components/tests/UserManagement";
import ResultsManagementPage from "../resultsManagment/page";
import AdminModal from "@/components/modals/AdminModal";



interface Test {
  id: string;
  title: string;
  subject?: string;
  duration?: number;
  difficulty?: string;
  status: "Active" | "Draft";
  description?: string;
  instructions?: string[];
  questions: any[] | number;
  created: string;
  createdAt?: Timestamp;
  length?: number;
}

interface Question {
  id: string;
  testId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  type: "multiple-choice";
}

interface NewTest {
  title: string;
  subject: string;
  duration: string;
  questions: string;
  difficulty: string;
  status: string;
  description: string;
  instructions: string[];
}

interface NewQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  type: "multiple-choice";
}

interface DashboardStats {
  totalTests: number;
  totalQuestions: number;
  activeTests: number;
  draftTests: number;
  totalUsers: number;
  totalSubmissions: number;
  testsChange: string;
  questionsChange: string;
  activeTestsChange: string;
  draftTestsChange: string;
  testsChangeDirection: "up" | "down";
  questionsChangeDirection: "up" | "down";
  activeTestsChangeDirection: "up" | "down";
  draftTestsChangeDirection: "up" | "down";
}

interface User {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  status: "active" | "inactive";
  joinDate: string;
  completedTests: number;
  totalTests: number;
  avgScore: number;
  createdAt?: any;
  testResults?: TestResult[];
}

interface TestResult {
  testName: string;
  score: number;
  date: string;
  duration: string;
  status: "completed" | "in-progress";
}

interface TestAnalytics {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
}

type Row = Record<string, string>;

/* ------------------ Utility functions ------------------ */

const calculateDashboardStats = (
  currentTests: Test[],
  previousTests: Test[],
  totalUsers: number,
  totalSubmissions: number
): DashboardStats => {
  const totalTests = currentTests.length;
  const totalQuestions = currentTests.reduce(
    (acc, test) =>
      acc + (Array.isArray(test.questions) ? test.questions.length : 0),
    0
  );
  const normalize = (status: string) => String(status).trim().toLowerCase();

  const activeTests = currentTests.filter(
    (t) => normalize(t.status) === "active"
  ).length;
  const draftTests = currentTests.filter(
    (t) => normalize(t.status) === "draft"
  ).length;
  const prevActiveTests = previousTests.filter(
    (t) => normalize(t.status) === "active"
  ).length;
  const prevDraftTests = previousTests.filter(
    (t) => normalize(t.status) === "draft"
  ).length;
  const prevTotalTests = previousTests.length;
  const prevTotalQuestions = previousTests.reduce(
    (acc, test) =>
      acc + (Array.isArray(test.questions) ? test.questions.length : 0),
    0
  );

  const calculateChange = (
    current: number,
    previous: number
  ): { change: string; direction: "up" | "down" } => {
    if (previous === 0) {
      return {
        change: current > 0 ? "+100%" : "0%",
        direction: current > 0 ? "up" : "up",
      };
    }

    const percentage = ((current - previous) / previous) * 100;
    const isPositive = percentage >= 0;

    return {
      change: `${isPositive ? "+" : ""}${Math.round(percentage)}%`,
      direction: isPositive ? "up" : "down",
    };
  };

  const testsChange = calculateChange(totalTests, prevTotalTests);
  const questionsChange = calculateChange(totalQuestions, prevTotalQuestions);
  const activeTestsChange = calculateChange(activeTests, prevActiveTests);
  const draftTestsChange = calculateChange(draftTests, prevDraftTests);

  return {
    totalTests,
    totalQuestions,
    activeTests,
    draftTests,
    totalUsers,
    totalSubmissions,
    testsChange: testsChange.change,
    questionsChange: questionsChange.change,
    activeTestsChange: activeTestsChange.change,
    draftTestsChange: draftTestsChange.change,
    testsChangeDirection: testsChange.direction,
    questionsChangeDirection: questionsChange.direction,
    activeTestsChangeDirection: activeTestsChange.direction,
    draftTestsChangeDirection: draftTestsChange.direction,
  };
};

const getTestsFromPeriod = async (
  startDate: Date,
  endDate: Date
): Promise<Test[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "tests"));
    const testsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Test[];
    return testsData.filter((test) => {
      const testDate = new Date(test.created);
      return testDate >= startDate && testDate <= endDate;
    });
  } catch (error) {

    return [];
  }
};

/* ------------------ Main component ------------------ */

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [tests, setTests] = useState<Test[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddTest, setShowAddTest] = useState<boolean>(false);
  const [showAddQuestion, setShowAddQuestion] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [analysisTestId, setAnalysisTestId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [pendingQuestions, setPendingQuestions] = useState<NewQuestion[]>([]); // Questions waiting to be added to a new test
  const [isEditingTest, setIsEditingTest] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);
  const [pendingDeleteTestId, setPendingDeleteTestId] = useState<string | null>(
    null
  );
  const [isNavigationModalVisible, setIsNavigationModalVisible] =
    useState(false);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [testAnalytics, setTestAnalytics] = useState<{
    [key: string]: TestAnalytics;
  }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showExportUsers, setShowExportUsers] = useState<boolean>(false);
  const [showUserAnalytics, setShowUserAnalytics] = useState<boolean>(false);
  const [activeTestCount, setActiveTestsCount] = useState(0);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalTests: 0,
    totalQuestions: 0,
    activeTests: 0,
    draftTests: 0,
    totalUsers: 0,
    totalSubmissions: 0,
    testsChange: "0%",
    questionsChange: "0%",
    activeTestsChange: "0%",
    draftTestsChange: "0%",
    testsChangeDirection: "up",
    questionsChangeDirection: "up",
    activeTestsChangeDirection: "up",
    draftTestsChangeDirection: "up",
  });

  const router = useRouter();

  const [newQuestion, setNewQuestion] = useState<NewQuestion>({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    type: "multiple-choice",
  });

  const [newTest, setNewTest] = useState<NewTest>({
    title: "",
    subject: "",
    duration: "",
    questions: "",
    difficulty: "",
    status: "",
    description: "",
    instructions: [""],
  });

  useEffect(() => {
    loadTests();
    loadQuestions();
  }, []);

  useEffect(() => {
    if (isAdminUser) {
      loadTests();
      loadQuestions();
      if (activeTab === "users") {
        loadUsers();
      }
    }
  }, [activeTab, isAdminUser]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please upload a valid CSV file.");
      e.target.value = "";
      return;
    }

    setLoading(true);
    setLoading(true);
    try {
      // Skip uploading to Firebase Storage to avoid CORS issues and save bandwidth.
      // We only need the file content to parse it.

      // const safeName = file.name.replace(/\s+/g, "_");
      // const fileRef = ref(storage, `csv-uploads/${safeName}`);
      // await uploadBytes(fileRef, file, { contentType: "text/csv" });
      // const url = await getDownloadURL(fileRef);
      // setDownloadURL(url);

      const text = await file.text();
      const parsed = Papa.parse<Row>(text, {
        header: true,
        skipEmptyLines: true,
      });
      setRows(parsed.data);
    } catch (err) {

      toast.error("Failed to upload CSV.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  const loadUsers = async (): Promise<void> => {
    try {
      setLoading(true);

      if (!isAdminUser) {
        toast.error("Access denied: Admin privileges required");
        return;
      }

      const usersData = await getAllUsers();

      const processedUsers = await Promise.all(
        usersData.map(async (user: any) => {
          try {
            const testResults = await getUserTestResultsById(user.id);

            const completedTests = testResults.filter(
              (r: any) => r.status === "completed"
            ).length;
            const avgScore =
              testResults.length > 0
                ? Math.round(
                  testResults.reduce(
                    (acc: number, r: any) => acc + (r.score || 0),
                    0
                  ) / testResults.length
                )
                : 0;
            const name =
              user.displayName || user.name || user.email || "Unknown User";

            return {
              id: user.id || user.uid,
              name: name,
              email: user.email || "No email",
              status: user.status || "active",
              joinDate: user.createdAt
                ? typeof user.createdAt.toDate === "function"
                  ? user.createdAt.toDate().toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  : new Date(user.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Unknown",

              completedTests,
              totalTests: testResults.length,
              avgScore,
              testResults: testResults.map((r: any) => ({
                testName: r.testName || r.testTitle || "Unknown Test",
                score: r.score || 0,
                date: r.completedAt
                  ? r.completedAt.toDate
                    ? new Date(r.completedAt.toDate()).toLocaleDateString()
                    : new Date(r.completedAt).toLocaleDateString()
                  : "Unknown",
                duration: r.timeTaken
                  ? `${Math.floor(r.timeTaken / 60)}m ${r.timeTaken % 60}s`
                  : "Unknown",

                status: r.status || "completed",
              })),
            } as User;
          } catch (error) {

            return {
              id: user.id,
              name: user.name || user.displayName || "Unknown User",
              email: user.email || "No email",
              status: (user.status as "active" | "inactive") || "active",
              joinDate: "Unknown",
              completedTests: 0,
              totalTests: 0,
              avgScore: 0,
              testResults: [],
            } as User;
          }
        })
      );

      setUsers(processedUsers);
    } catch (error) {

      toast.error("Failed to load users: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const confirmLogout = () => {
    setIsModalVisible(false);
    handleLogout();
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      sessionStorage.clear();
      Cookies.remove("token");
      await signOut(auth);
      toast.success("Logout successful");
      router.replace("/home");
    } catch (error) {

      toast.error("Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  const cancelLogout = () => setIsModalVisible(false);

  const onClose = () => {
    setShowAddTest(false);
  };

  const loadTests = async (): Promise<void> => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "tests"));
      const testsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Test[];
      setTests(testsData);
      const analyticsData: { [key: string]: TestAnalytics } = {};
      await Promise.all(
        testsData.map(async (test) => {
          try {
            const analytics = await getTestAnalytics(test.id);
            if (analytics) {
              analyticsData[test.id] = analytics;
            }
          } catch (error) {

          }
        })
      );
      setTestAnalytics(analyticsData);

      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date(today);
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
      const currentPeriodTests = await getTestsFromPeriod(thirtyDaysAgo, today);
      const previousPeriodTests = await getTestsFromPeriod(
        sixtyDaysAgo,
        thirtyDaysAgo
      );

      const totalUsers = users?.length || 0;
      const totalSubmissions = Object.values(analyticsData).reduce(
        (acc, analytics) => acc + analytics.totalAttempts,
        0
      );

      const stats = calculateDashboardStats(
        currentPeriodTests,
        previousPeriodTests,
        totalUsers,
        totalSubmissions
      );

      const activeCount =
        (currentPeriodTests?.filter((t) => t.status === "Active").length || 0) +
        (previousPeriodTests?.filter((t) => t.status === "Active").length || 0);

      setActiveTestsCount(activeCount);
      setDashboardStats(stats);
    } catch (error) {

      toast.error("Failed to load tests");
    } finally {
      setLoading(false);
    }
  };

  const memoizedFilteredUsers = useMemo(() => {
    return (
      users?.filter((user) => {
        const matchesSearch =
          user?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
          user?.email?.toLowerCase().includes(searchTerm?.toLowerCase());

        const matchesStatus =
          filterStatus === "all" || user?.status === filterStatus;

        return matchesSearch && matchesStatus;
      }) || []
    );
  }, [users, searchTerm, filterStatus]);

  const loadQuestions = async (): Promise<void> => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "tests"));
      const questionsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Question[];
      setQuestions(questionsData);
    } catch (error) {

      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId: string): Promise<void> => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "tests", testId));
      const questionsQuery = query(
        collection(db, "tests"),
        where("testId", "==", testId)
      );
      const questionSnapshot = await getDocs(questionsQuery);

      const deletePromises = questionSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);
      setTests(tests.filter((t) => t.id !== testId));
      setQuestions(questions.filter((q) => q.testId !== testId));
      if (selectedTest?.id === testId) {
        setSelectedTest(null);
      }
      await loadTests();
      toast.success("Test deleted successfully!");
    } catch (error) {

      toast.error("Failed to delete test");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (): Promise<void> => {
    if (!newQuestion.question.trim() || !selectedTest) return;
    const questionId = uuidv4();
    setLoading(true);
    try {
      const questionData = {
        id: questionId,
        testId: selectedTest.id,
        question: newQuestion.question,
        options: newQuestion.options.filter((opt) => opt.trim() !== ""),

        type: newQuestion.type,
      };

      const testRef = doc(db, "tests", selectedTest.id);
      await updateDoc(testRef, {
        questions: arrayUnion(questionData),
      });

      await setDoc(
        doc(db, "answers", selectedTest.id),
        {

          [questionId]: newQuestion.correctAnswer
        },
        { merge: true }
      );

      const updatedTests = tests.map((t) =>
        t.id === selectedTest.id
          ? {
            ...t,
            questions: Array.isArray(t.questions)
              ? [...t.questions, questionData]
              : [questionData],
          }
          : t
      );

      setTests(updatedTests);

      setSelectedTest((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: Array.isArray(prev.questions)
            ? [...prev.questions, questionData]
            : [questionData],
        };
      });

      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        type: "multiple-choice",
      });
      setShowAddQuestion(false);
      await loadTests();
      toast.success("Question added successfully!");
    } catch (error) {

      toast.error("Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAddQuestions = async (newQuestions: NewQuestion[]): Promise<void> => {
    if (!selectedTest || newQuestions.length === 0) return;

    setLoading(true);
    try {
      const questionsData = newQuestions.map(q => ({
        id: uuidv4(),
        testId: selectedTest.id,
        question: q.question,
        options: q.options.filter((opt) => opt.trim() !== ""),
        type: q.type,
      }));

      // Create answers map
      const answersMap: Record<string, number> = {};
      questionsData.forEach((q, index) => {
        answersMap[q.id] = newQuestions[index].correctAnswer;
      });

      const testRef = doc(db, "tests", selectedTest.id);

      // Update questions in test document
      await updateDoc(testRef, {
        questions: arrayUnion(...questionsData),
      });

      // Update answers document
      await setDoc(
        doc(db, "answers", selectedTest.id),
        answersMap,
        { merge: true }
      );

      // Update local state
      const updatedTests = tests.map((t) =>
        t.id === selectedTest.id
          ? {
            ...t,
            questions: Array.isArray(t.questions)
              ? [...t.questions, ...questionsData]
              : [...questionsData],
          }
          : t
      );

      setTests(updatedTests);

      setSelectedTest((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: Array.isArray(prev.questions)
            ? [...prev.questions, ...questionsData]
            : [...questionsData],
        };
      });

      setRows([]); // Clear CSV data
      await loadTests();
      toast.success(`${newQuestions.length} questions imported successfully!`);
    } catch (error) {
      console.error("Bulk add error:", error);
      toast.error("Failed to import questions");
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question: Question): void => {
    setEditingQuestion({ ...question });
  };

  const handleSaveQuestion = async (): Promise<void> => {
    if (!editingQuestion) return;

    setLoading(true);
    try {
      const { testId, id } = editingQuestion;
      const testRef = doc(db, "tests", testId);
      const testSnap = await getDoc(testRef);
      if (!testSnap.exists()) {

        return;
      }

      const testData = testSnap.data();
      const existingQuestions = testData.questions || [];
      const updatedQuestions = existingQuestions.map((q: any) =>
        q.id === id ? editingQuestion : q
      );
      await updateDoc(testRef, {
        questions: updatedQuestions,
      });

      setQuestions((prevTests) =>
        prevTests.map((test) =>
          test.id === testId ? { ...test, questions: updatedQuestions } : test
        )
      );

      setSelectedTest((prev) =>
        prev?.id === testId ? { ...prev, questions: updatedQuestions } : prev
      );

      setEditingQuestion(null);
      await loadTests();
      toast.success("Question updated successfully!");
    } catch (error) {

      toast.error("Failed to update question");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string): Promise<void> => {
    if (!selectedTest || !Array.isArray(selectedTest.questions)) return;

    setLoading(true);
    try {
      const updatedTestQuestions = selectedTest.questions.filter(
        (question) => question.id !== questionId
      );

      const testRef = doc(db, "tests", selectedTest.id);
      await updateDoc(testRef, {
        questions: updatedTestQuestions,
      });

      setSelectedTest((prev) =>
        prev ? { ...prev, questions: updatedTestQuestions } : null
      );

      setQuestions((prevTests) =>
        prevTests.map((test: any) =>
          test.id === selectedTest.id
            ? { ...test, questions: updatedTestQuestions }
            : test
        )
      );
      await loadTests();
      toast.success("Question deleted successfully!");
    } catch (error: any) {

      toast.error("Failed to delete question");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions: Question[] = Array.isArray(selectedTest?.questions)
    ? selectedTest.questions
    : Object.values(selectedTest?.questions || {});

  const onSelect = (option: string, index: number): void => {
    setNewQuestion({
      ...newQuestion,
      correctAnswer: index,
    });
  };

  const handleInstructionChange = (index: number, value: string): void => {
    const updated = [...newTest.instructions];
    updated[index] = value;
    setNewTest({ ...newTest, instructions: updated });
  };

  const addInstruction = (): void => {
    setNewTest({ ...newTest, instructions: [...newTest.instructions, ""] });
  };

  const removeInstruction = (index: number): void => {
    const updated = newTest.instructions.filter((_, i) => i !== index);
    setNewTest({ ...newTest, instructions: updated });
  };

  const handleAddTest = async (): Promise<void> => {
    if (!newTest.title.trim() || !newTest.subject.trim()) return;

    setLoading(true);
    try {
      // Prepare questions if any
      let questionsForCreation: any[] = [];

      if (pendingQuestions.length > 0) {
        questionsForCreation = pendingQuestions.map(q => ({
          id: uuidv4(),
          question: q.question,
          options: q.options.filter(o => o.trim() !== ""),
          correctAnswer: q.correctAnswer,
          type: q.type,
          difficulty: newTest.difficulty // Inherit test difficulty if not specified
        }));
      }

      const testData = {
        title: newTest.title,
        subject: newTest.subject,
        duration: parseInt(newTest.duration) || 0,
        questions: questionsForCreation,
        difficulty: newTest.difficulty,
        status: newTest.status || "draft",
        description: newTest.description,
        instructions: newTest.instructions.filter((i) => i.trim() !== ""),
        created: new Date().toISOString().split("T")[0],
        createdAt: Timestamp.now(),
      };

      // This helper handles saving questions AND creating the secure 'answers' document
      const docId = await setDocByFirebase(testData);

      const newTestWithId: Test = {
        id: docId,
        ...testData,
        status: (testData.status as "Active" | "Draft") || "Draft",
        questions: questionsForCreation // update with array, not length
      };

      setTests([...tests, newTestWithId]);
      setNewTest({
        title: "",
        subject: "",
        duration: "",
        questions: "", // leave text input empty
        difficulty: "",
        status: "",
        description: "",
        instructions: [""],
      });
      setPendingQuestions([]); // Clear pending questions
      setShowAddTest(false);
      await loadTests();
      if (questionsForCreation.length > 0) {
        toast.success(`Test created with ${questionsForCreation.length} questions!`);
      } else {
        toast.success("Test created successfully!");
      }
    } catch (error: any) {
      console.error("Error creating test:", error);
      toast.error(`Failed to create test: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTestClick = (test: Test) => {
    setNewTest({
      title: test.title,
      subject: test.subject || "",
      duration: test.duration?.toString() || "",
      questions: "",
      difficulty: test.difficulty || "",
      status: test.status,
      description: test.description || "",
      instructions: test.instructions || [""],
    });
    setEditingTestId(test.id);
    setIsEditingTest(true);
    setShowAddTest(true);
  };

  const handleUpdateTest = async () => {
    if (!editingTestId || !newTest.title.trim()) return;
    setLoading(true);
    try {
      const testRef = doc(db, "tests", editingTestId);
      const updates: any = {
        title: newTest.title,
        subject: newTest.subject,
        duration: parseInt(newTest.duration) || 0,
        difficulty: newTest.difficulty,
        status: newTest.status || "Draft",
        description: newTest.description,
        instructions: newTest.instructions.filter((i) => i.trim() !== "")
      };

      // Handle CSV questions added during edit
      if (pendingQuestions.length > 0) {
        const newQuestions = pendingQuestions.map(q => ({
          id: uuidv4(),
          question: q.question,
          options: q.options.filter(o => o.trim() !== ""),
          correctAnswer: q.correctAnswer,
          type: q.type,
          difficulty: newTest.difficulty,
          testId: editingTestId
        }));

        // Add to 'tests' doc
        updates.questions = arrayUnion(...newQuestions);

        // Update 'answers' doc
        const answersMap: Record<string, number> = {};
        newQuestions.forEach(q => answersMap[q.id] = q.correctAnswer);
        await setDoc(doc(db, "answers", editingTestId), answersMap, { merge: true });
      }

      await updateDoc(testRef, updates);

      setIsEditingTest(false);
      setEditingTestId(null);
      setShowAddTest(false);
      setPendingQuestions([]);
      setNewTest({
        title: "",
        subject: "",
        duration: "",
        questions: "",
        difficulty: "",
        status: "",
        description: "",
        instructions: [""],
      });
      await loadTests();
      toast.success("Test updated successfully");

    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to update test: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStatsArray = [
    {
      title: "Total Tests",
      value: tests.length,
      icon: FileText,
      color: "blue",
      change: dashboardStats.testsChange,
      trend: dashboardStats.testsChangeDirection,
    },
    {
      title: "Total Questions",
      value: tests.reduce(
        (sum, test) =>
          sum + Math.min((test?.questions as any[])?.length || 0, 50),
        0
      ),

      icon: FileQuestion,
      color: "green",
      change: dashboardStats.questionsChange,
      trend: dashboardStats.questionsChangeDirection,
    },
    {
      title: "Total Users",
      value: users?.length,
      icon: Users,
      color: "purple",
      change: "+0%",
      trend: "up" as const,
    },
    {
      title: "Active Tests",
      value: dashboardStats.activeTests,
      icon: TrendingUp,
      color: "yellow",
      change: dashboardStats.activeTestsChange,
      trend: dashboardStats.activeTestsChangeDirection,
    },
  ];

  return (
    <div className="h-full bg-slate-50 overflow-hidden">
      {loading && <Loader />}

      <div className="flex h-full">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={() => setIsModalVisible(true)}
          loading={loading}
        />

        <div className="flex-1 ml-64 overflow-y-auto">
          <div className="p-8">
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Dashboard
                  </h1>
                  <p className="text-slate-600">
                    Monitor your test management system performance
                  </p>
                </div>

                <StatsCards stats={dashboardStatsArray as any} />

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <Award className="mr-3 text-blue-600" /> Recent Tests
                    </h2>
                  </div>
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <RecentTests tests={tests} testAnalytics={testAnalytics} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PerformanceOverview
                    tests={tests}
                    testAnalytics={testAnalytics}
                  />
                  <SystemHealth
                    activeTests={dashboardStats.activeTests}
                    draftTests={dashboardStats.draftTests}
                    totalUsers={dashboardStats.totalUsers}
                    totalSubmissions={dashboardStats.totalSubmissions}
                  />
                </div>
              </div>
            )}

            {activeTab === "tests" && (
              <TestManagement
                tests={tests}
                selectedTest={selectedTest}
                setSelectedTest={setSelectedTest}
                handleDeleteTest={handleDeleteTest}
                handleAddTest={handleAddTest}
                loading={loading}
                showAddTest={showAddTest}
                setShowAddTest={setShowAddTest}
                onClose={onClose}
                newTest={newTest}
                setNewTest={setNewTest}
                handleInstructionChange={handleInstructionChange}
                addInstruction={addInstruction}
                removeInstruction={removeInstruction}
                showAddQuestion={showAddQuestion}
                setShowAddQuestion={setShowAddQuestion}
                newQuestion={newQuestion}
                setNewQuestion={setNewQuestion}
                onSelect={onSelect}
                handleAddQuestion={handleAddQuestion}
                handleEditQuestion={handleEditQuestion}
                handleSaveQuestion={handleSaveQuestion}
                handleDeleteQuestion={handleDeleteQuestion}
                filteredQuestions={filteredQuestions}
                editingQuestion={editingQuestion}
                setEditingQuestion={setEditingQuestion}
                setAnalysisTestId={setAnalysisTestId}
                analysisTestId={analysisTestId}
                testAnalytics={testAnalytics}
                pendingDeleteTestId={pendingDeleteTestId}
                setPendingDeleteTestId={setPendingDeleteTestId}
                isNavigationModalVisible={isNavigationModalVisible}
                setIsNavigationModalVisible={setIsNavigationModalVisible}
                users={users}
                handleFileUpload={handleFileUpload}
                csvData={rows}
                setCsvData={setRows}
                handleBulkAddQuestions={handleBulkAddQuestions}
                pendingQuestions={pendingQuestions}
                setPendingQuestions={setPendingQuestions}
                handleUpdateTest={handleUpdateTest}
                handleEditTestClick={handleEditTestClick}
                isEditingTest={isEditingTest}
              />
            )}

            {activeTab === "users" && (
              <UserManagement
                users={users}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                loading={loading}
                loadUsers={loadUsers}
                handleFileUpload={handleFileUpload}
                showExportUsers={showExportUsers}
                setShowExportUsers={setShowExportUsers}
                showUserAnalytics={showUserAnalytics}
                setShowUserAnalytics={setShowUserAnalytics}
                filteredUsers={memoizedFilteredUsers}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
            )}

            {activeTab === "results" && <ResultsManagementPage />}

            {isModalVisible && (
              <AdminModal
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                visible={isModalVisible}
                onConfirm={confirmLogout}
                onCancel={cancelLogout}
              />
            )}

            {isNavigationModalVisible && (
              <AdminModal
                title="Delete Test"
                message="Are you sure you want to delete this test? This action cannot be undone."
                visible={isNavigationModalVisible}
                onConfirm={async () => {
                  if (pendingDeleteTestId) {
                    await handleDeleteTest(pendingDeleteTestId);
                  }
                  setIsNavigationModalVisible(false);
                  setPendingDeleteTestId(null);
                }}
                onCancel={() => {
                  setIsNavigationModalVisible(false);
                  setPendingDeleteTestId(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
