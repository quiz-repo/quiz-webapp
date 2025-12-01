"use client";
import React, { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import Papa from "papaparse";
import { Result } from "antd";
import {
  LogOutIcon,
  BarChart3,
  FileText,
  Award,
  TrendingUp,
  FileQuestion,
  Users,
  Target,
  Activity,
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
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
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
import AdminModal from "../components/modals/AdminModal";
import UserManagement from "../components/UserManagement";
import TestManagement from "../components/TestManagement";
import ResultsManagement from "../resultsManagment/page";

interface Test {
  id: string;
  title: string;
  subject?: string;
  duration?: number;
  difficulty?: string;
  status: "Active" | "Draft";
  description?: string;
  instructions?: string[];
  questions: Question[] | number;
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
    console.error("Error getting tests from period:", error);
    return [];
  }
};

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
  console.log(dashboardStats, "dashboardStatsttt");

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
    try {
      const safeName = file.name.replace(/\s+/g, "_");
      const fileRef = ref(storage, `csv-uploads/${safeName}`);
      await uploadBytes(fileRef, file, { contentType: "text/csv" });
      const url = await getDownloadURL(fileRef);
      setDownloadURL(url);
      toast.success("CSV uploaded!");
      const text = await file.text();
      const parsed = Papa.parse<Row>(text, {
        header: true,
        skipEmptyLines: true,
      });
      setRows(parsed.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload CSV.");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  // const fetchAndParseFromURL = async () => {
  //   if (!downloadURL) return;
  //   const res = await fetch(downloadURL);
  //   const text = await res.text();
  //   const parsed = Papa.parse<Row>(text, {
  //     header: true,
  //     skipEmptyLines: true,
  //   });
  //   setRows(parsed.data);
  // };

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
                duration: r.duration || r.timeTaken || "Unknown",
                status: r.status || "completed",
              })),
            } as User;
          } catch (error) {
            console.error(`Error processing user ${user.id}:`, error);
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
      console.error("Error loading users:", error);
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
      console.error("Logout error:", error);
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
            // Ensure data is received before setting
            if (analytics) {
              analyticsData[test.id] = analytics;
            }
          } catch (error) {
            console.error(
              `Error loading analytics for test ${test.id}:`,
              error
            );
          }
        })
      );
      setTestAnalytics(analyticsData);
      // console.log(analyticsData, "dataaaaaaaa");
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
      console.log(totalUsers, "totalusersss");
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
      setDashboardStats(stats);
      console.log(stats, "statsss");
    } catch (error) {
      console.error("Error loading tests:", error);
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
      console.error("Error loading questions:", error);
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
      console.error("Error deleting test:", error);
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
        correctAnswer: newQuestion.correctAnswer,
        type: newQuestion.type,
      };

      const testRef = doc(db, "tests", selectedTest.id);
      await updateDoc(testRef, {
        questions: arrayUnion(questionData),
      });

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
      console.error("Error adding question:", error);
      toast.error("Failed to add question");
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
        console.error("Test document not found");
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
      console.error("Error updating question:", error);
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
      console.error("Error deleting question:", error.message || error);
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
      const testData = {
        title: newTest.title,
        subject: newTest.subject,
        duration: parseInt(newTest.duration) || 0,
        questions: parseInt(newTest.questions) || 0,
        difficulty: newTest.difficulty,
        status: newTest.status || "draft",
        description: newTest.description,
        instructions: newTest.instructions.filter((i) => i.trim() !== ""),
        created: new Date().toISOString().split("T")[0],
        createdAt: Timestamp.now(),
      };

      const docId = await setDocByFirebase(testData);
      const newTestWithId: Test = {
        id: docId,
        ...testData,
        status: (testData.status as "Active" | "Draft") || "Draft",
      };

      setTests([...tests, newTestWithId]);
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
      setShowAddTest(false);
      await loadTests();
      toast.success("Test created successfully!");
    } catch (error) {
      console.error("Error adding test:", error);
      toast.error("Failed to create test");
    } finally {
      setLoading(false);
    }
  };
  console.log("Total Questions Data:", {
    totalQuestions: dashboardStats.totalQuestions,
  });
  const dashboardStatsArray = [
    {
      title: "Total Tests",
      value: dashboardStats.totalTests,
      icon: FileText,
      color: "blue",
      change: dashboardStats.testsChange,
      trend: dashboardStats.testsChangeDirection,
    },
    {
      title: "Total Questions",
      value: dashboardStats.totalQuestions,
      icon: FileQuestion,
      color: "green",
      change: dashboardStats.questionsChange,
      trend: dashboardStats.questionsChangeDirection,
    },
    {
      title: "Total Users",
      value: dashboardStats?.totalUsers,
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
    <div className="h-[100%] bg-slate-50 overflow-hidden">
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border border-slate-200">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium">Loading...</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-[100%]">
        <div className="bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between h-screen fixed">
          <div className="p-8">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Quizz Pro</h1>
                <p className="text-sm text-slate-500">Admin Dashboard</p>
              </div>
            </div>
            <nav className="space-y-2">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                { id: "tests", label: "Tests", icon: FileText },
                { id: "users", label: "Users", icon: Users },
                { id: "results", label: "Result", icon: Users },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left h-[100%] cursor-pointer ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center ${
                      activeTab === item.id ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    <item.icon
                      className={`${
                        item.id === "results"
                          ? "text-[20px] leading-none" // Fix AntD icon sizing
                          : "w-5 h-5"
                      }`}
                      style={{
                        fontSize: item.id === "results" ? 20 : undefined,
                      }}
                    />
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            <button
              onClick={() => setIsModalVisible(true)}
              disabled={loading}
              className="w-full cursor-pointer bg-red-50 text-red-700 border border-red-200 px-4 py-3.5 rounded-xl font-medium hover:bg-red-100 transition-all disabled:opacity-50 flex items-center justify-center h-[100%]"
            >
              {loading ? (
                <svg
                  className="animate-spin mr-2 w-5 h-5 text-red-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                <LogOutIcon className="mr-2 w-5 h-5" />
              )}
              {loading ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dashboardStatsArray.map((stat, index) => {
                    console.log("Stat Item:", stat); //

                    return (
                      <div
                        key={stat.title}
                        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              stat.color === "blue"
                                ? "bg-blue-50 text-blue-600"
                                : stat.color === "green"
                                ? "bg-emerald-50 text-emerald-600"
                                : stat.color === "yellow"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-purple-50 text-purple-600"
                            }`}
                          >
                            <stat.icon className="w-6 h-6" />
                          </div>
                          <div
                            className={`flex items-center text-sm font-medium ${
                              stat.trend === "up"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            <TrendingUp
                              className={`w-4 h-4 mr-1 ${
                                stat.trend === "down" ? "rotate-180" : ""
                              }`}
                            />
                            {stat.change}
                          </div>
                        </div>

                        <div>
                          <p className="text-3xl font-bold text-slate-900 mb-1">
                            {stat.value}
                          </p>
                          <p className="text-slate-500 font-medium">
                            {stat.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <Award className="mr-3 text-blue-600" /> Recent Tests
                    </h2>
                  </div>
                  <div className="p-6 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {tests.slice(0, 5).map((test) => (
                        <div
                          key={test.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {test.title}
                              </h3>
                              <p className="text-slate-500 text-sm">
                                {test.subject} • {test.created} •{" "}
                                {Array.isArray(test.questions)
                                  ? test.questions.length
                                  : typeof test.questions === "number"
                                  ? test.questions
                                  : 0}{" "}
                                questions
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                                test.status?.toLowerCase() === "active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {test.status.charAt(0).toUpperCase() +
                                test.status.slice(1).toLowerCase()}
                            </span>
                            {testAnalytics[test.id] &&
                              (console.log(
                                testAnalytics[test.id].averageScore,
                                "vhjhvjhvhj"
                              ),
                              (
                                <div className="text-xs text-slate-600">
                                  {testAnalytics[test.id].totalAttempts}{" "}
                                  attempts •{" "}
                                  {testAnalytics[test.id].averageScore.toFixed(
                                    1
                                  )}{" "}
                                  avg % avg
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Activity className="mr-2 text-blue-600" /> Test
                      Performance Overview
                    </h3>
                    <div className="space-y-4">
                      {tests.slice(0, 3).map((test) => {
                        const analytics = testAnalytics[test.id];
                        return (
                          <div
                            key={test.id}
                            className="flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 truncate">
                                {test.title}
                              </p>
                              <p className="text-sm text-slate-500">
                                {test.subject}
                              </p>
                            </div>
                            {analytics && (
                              <div className="text-right">
                                <p className="text-sm font-medium text-slate-900">
                                  {Math.round(analytics.averageScore)}% avg
                                </p>
                                <p className="text-xs text-slate-500">
                                  {analytics.totalAttempts} attempts
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Target className="mr-2 text-green-600" /> System Health
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Active Tests</span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="font-medium">
                            {dashboardStats.activeTests}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Draft Tests</span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="font-medium">
                            {dashboardStats.draftTests}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Total Users</span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          <span className="font-medium">
                            {dashboardStats.totalUsers}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">
                          Total Submissions
                        </span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          <span className="font-medium">
                            {dashboardStats.totalSubmissions}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
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

            {activeTab === "results" && (
              <ResultsManagement
                users={users}
                tests={tests}
                loading={loading}
              />
            )}

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
