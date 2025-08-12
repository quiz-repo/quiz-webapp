"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  LogOutIcon,
  Edit,
  BarChart3,
  FileText,
  Clock,
  Award,
  TrendingUp,
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
import { db, setDocByFirebase, auth, signOut } from "@/lib/Firebase";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import AdminModal from "../components/modals/AdminModal";
import { Select } from "antd";

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
  testsChange: string;
  questionsChange: string;
  activeTestsChange: string;
  draftTestsChange: string;
  testsChangeDirection: "up" | "down";
  questionsChangeDirection: "up" | "down";
  activeTestsChangeDirection: "up" | "down";
  draftTestsChangeDirection: "up" | "down";
}

const calculateDashboardStats = (
  currentTests: Test[],
  previousTests: Test[]
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
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    const querySnapshot = await getDocs(collection(db, "tests"));
    const testsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Test[];
    return testsData.filter((test) => {
      const testDate = test.created;
      return testDate >= startDateStr && testDate <= endDateStr;
    });
  } catch (error) {
    console.error("Error getting tests from period:", error);
    return [];
  }
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [tests, setTests] = useState<Test[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddTest, setShowAddTest] = useState<boolean>(false);
  const [showAddQuestion, setShowAddQuestion] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendingDeleteTestId, setPendingDeleteTestId] = useState<string | null>(
    null
  );
  const [isNavigationModalVisible, setIsNavigationModalVisible] =
    useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalTests: 0,
    totalQuestions: 0,
    activeTests: 0,
    draftTests: 0,
    testsChange: "0%",
    questionsChange: "0%",
    activeTestsChange: "0%",
    draftTestsChange: "0%",
    testsChangeDirection: "up",
    questionsChangeDirection: "up",
    activeTestsChangeDirection: "up",
    draftTestsChangeDirection: "up",
  });
  console.log(dashboardStats, "kjlghuigiughuigh");
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
      router.replace("/homes");
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
      const stats = calculateDashboardStats(
        currentPeriodTests,
        previousPeriodTests
      );
      setDashboardStats(stats);
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setLoading(false);
    }
  };

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

      console.log("Test and associated questions deleted successfully!");
    } catch (error) {
      console.error("Error deleting test:", error);
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

      console.log("Question added successfully!");
    } catch (error) {
      console.error("Error adding question:", error);
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

      // Recalculate stats after editing question
      await loadTests();

      console.log("Question updated successfully!");
    } catch (error) {
      console.error("Error updating question:", error);
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

      // Recalculate stats after deleting question
      await loadTests();

      console.log("Question deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting question:", error.message || error);
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
        createdAt: Timestamp.now(), // Add timestamp for better querying
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

      // Recalculate stats after adding test
      await loadTests();

      console.log("Test added successfully!");
    } catch (error) {
      console.error("Error adding test:", error);
    } finally {
      setLoading(false);
    }
  };
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
      icon: Edit2,
      color: "green",
      change: dashboardStats.questionsChange,
      trend: dashboardStats.questionsChangeDirection,
    },
    {
      title: "Active Tests",
      value: dashboardStats.activeTests,
      icon: TrendingUp,
      color: "yellow",
      change: dashboardStats.activeTestsChange,
      trend: dashboardStats.activeTestsChangeDirection,
    },
    {
      title: "Draft Tests",
      value: dashboardStats.draftTests,
      icon: Clock,
      color: "purple",
      change: dashboardStats.draftTestsChange,
      trend: dashboardStats.draftTestsChangeDirection,
    },
  ];

  return (
    <div className="h-[100%]  bg-slate-50 overflow-hidden">
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
        <div className=" bg-white border-r border-slate-200 shadow-sm flex flex-col justify-between h-screen fixed">
          {/* Top Section */}
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
                  <item.icon
                    className={`w-5 h-5 ${
                      activeTab === item.id ? "text-blue-600" : "text-slate-400"
                    }`}
                  />
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
              <LogOutIcon className="mr-2 w-5 h-5 " />
              Sign Out
            </button>
          </div>
        </div>
        <div className="w-[calc(100vw-246px)] ml-auto">
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
                  {dashboardStatsArray.map((stat, index) => (
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
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6 max-h-[350px] flex flex-col">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <Award className="mr-3 text-blue-600" />
                      Recent Tests
                    </h2>
                  </div>

                  <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    {tests.map((test) => (
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
                              {test.subject} • {test.created}
                            </p>
                          </div>
                        </div>
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
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tests" && (
              <div className="space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      Test Management
                    </h1>
                    <p className="text-slate-600">
                      Create, edit, and manage your tests
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddTest(true)}
                    disabled={loading}
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Test
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Tests List */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                      <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                        <FileText className="mr-3 text-blue-600" />
                        All Tests ({tests.length})
                      </h2>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {tests.map((test) => (
                          <div
                            key={test.id}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                              selectedTest?.id === test.id
                                ? "border-blue-200 bg-blue-50 shadow-sm"
                                : "border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200"
                            }`}
                            onClick={() => setSelectedTest(test)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-white" />
                                  </div>
                                  <h3 className="font-semibold text-slate-900 truncate">
                                    {test.title}
                                  </h3>
                                </div>
                                <p className="text-sm text-slate-600 ml-11 mb-2">
                                  {test.subject} •{" "}
                                  {Array.isArray(test.questions)
                                    ? test.questions.length
                                    : typeof test.questions === "number"
                                    ? test.questions
                                    : 0}{" "}
                                  questions
                                </p>
                                <div className="ml-11 flex items-center space-x-3">
                                  <span className="text-xs text-slate-500">
                                    {test.created}
                                  </span>
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
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPendingDeleteTestId(test.id);
                                  setIsNavigationModalVisible(true);
                                }}
                                disabled={loading}
                                className="text-red-400  cursor-pointer hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl  font-semibold text-slate-900 flex items-center">
                          <Edit2 className="mr-3  text-blue-600" />
                          {selectedTest
                            ? `Questions for "${selectedTest.title}"`
                            : "Select a test to view questions"}
                        </h2>
                        {selectedTest && (
                          <button
                            onClick={() => setShowAddQuestion(true)}
                            disabled={loading}
                            className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center transition-colors shadow-sm disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Question
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {filteredQuestions.map((question, index) => {
                          return (
                            <div
                              key={question.id}
                              className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center space-x-2">
                                  <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                    {index + 1}
                                  </span>
                                  <h4 className="font-medium text-sm text-slate-600">
                                    Question {index + 1}
                                  </h4>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditQuestion(question)}
                                    disabled={loading}
                                    className="text-blue-400 cursor-pointer hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteQuestion(question.id)
                                    }
                                    disabled={loading}
                                    className="text-red-400 cursor-pointer  hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm mb-3 text-slate-900 font-medium">
                                {question.question}
                              </p>
                              <div className="space-y-2">
                                {question.options?.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`text-xs p-3 rounded-lg border transition-all ${
                                      optIndex === question.correctAnswer
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        : "bg-white text-slate-600 border-slate-200"
                                    }`}
                                  >
                                    <span className="font-semibold">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>{" "}
                                    {option}
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Add Test Modal */}
            {showAddTest && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">
                            Create New Test
                          </h3>
                          <p className="text-slate-600 text-sm">
                            Add a comprehensive test to your library
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <X className="w-5 cursor-pointer h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Test Title
                          </label>
                          <input
                            type="text"
                            placeholder="Enter test title"
                            value={newTest.title}
                            onChange={(e) =>
                              setNewTest({ ...newTest, title: e.target.value })
                            }
                            className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Subject
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., JavaScript, React, Node.js"
                            value={newTest.subject}
                            onChange={(e) =>
                              setNewTest({
                                ...newTest,
                                subject: e.target.value,
                              })
                            }
                            className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Duration (mins)
                          </label>
                          <input
                            type="number"
                            placeholder="60"
                            value={newTest.duration}
                            onChange={(e) =>
                              setNewTest({
                                ...newTest,
                                duration: e.target.value,
                              })
                            }
                            className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Questions
                          </label>
                          <input
                            type="number"
                            placeholder="10"
                            value={newTest.questions}
                            onChange={(e) =>
                              setNewTest({
                                ...newTest,
                                questions: e.target.value,
                              })
                            }
                            className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Difficulty
                          </label>
                          <Select
                            value={newTest.difficulty}
                            onChange={(value) =>
                              setNewTest({
                                ...newTest,
                                difficulty: value,
                              })
                            }
                            className="custom-select"
                            style={{ width: "190px", height: "48px" }}
                            options={[
                              { value: "", label: "Select difficulty" },
                              { value: "Beginner", label: "Beginner" },
                              { value: "Intermediate", label: "Intermediate" },
                              { value: "Advanced", label: "Advanced" },
                            ]}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Status
                        </label>

                        <Select
                          value={newTest.status}
                          // allowClear
                          onChange={(value) =>
                            setNewTest({ ...newTest, status: value })
                          }
                          className="custom-select-advance"
                          style={{ width: "100%", height: "48px" }}
                          options={[
                            { value: "", label: "Select status" },
                            { value: "Draft", label: "Draft" },
                            { value: "Active", label: "Active" },
                          ]}
                        />

                        {/* <select
                          value={newTest.status}
                          onChange={(e) =>
                            setNewTest({ ...newTest, status: e.target.value })
                          }
                          className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select status</option>
                          <option value="Draft">Draft</option>
                          <option value="Active">Active</option>
                        </select> */}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Description
                        </label>
                        <textarea
                          placeholder="Test description..."
                          value={newTest.description}
                          onChange={(e) =>
                            setNewTest({
                              ...newTest,
                              description: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">
                          Instructions
                        </label>
                        {newTest.instructions.map((inst, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 mb-3"
                          >
                            <div className="flex-1">
                              <input
                                type="text"
                                value={inst}
                                onChange={(e) =>
                                  handleInstructionChange(idx, e.target.value)
                                }
                                className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Instruction ${idx + 1}`}
                              />
                            </div>
                            {newTest.instructions.length > 1 && (
                              <button
                                onClick={() => removeInstruction(idx)}
                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <X className="w-4 cursor-pointer h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addInstruction}
                          className="text-blue-600 cursor-pointer hover:text-blue-700 text-sm font-medium flex items-center hover:underline"
                        >
                          <Plus className=" w-4 h-4 mr-1" />
                          Add Instruction
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-slate-200">
                    <div className="flex space-x-4">
                      <button
                        onClick={handleAddTest}
                        disabled={false}
                        className="flex-1 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Create Test
                      </button>
                      <button
                        onClick={onClose}
                        className="px-6 py-3 cursor-pointer bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showAddQuestion && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200">
                  <div className="p-4 border-b border-slate-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            Add New Question
                          </h3>
                          <p className="text-slate-600 text-sm">
                            Create a multiple choice question
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAddQuestion(false)}
                        className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <X className="w-5 cursor-pointer h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Question
                        </label>
                        <textarea
                          placeholder="Enter your question here..."
                          value={newQuestion.question}
                          onChange={(e) =>
                            setNewQuestion({
                              ...newQuestion,
                              question: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Answer Options
                        </label>
                        <div className="space-y-2">
                          {newQuestion.options.map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-3"
                            >
                              <input
                                type="radio"
                                name="correctAnswer"
                                checked={newQuestion.correctAnswer === index}
                                onChange={() => onSelect(option, index)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                              />
                              <span className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <input
                                type="text"
                                placeholder={`Option ${String.fromCharCode(
                                  65 + index
                                )}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...newQuestion.options];
                                  newOptions[index] = e.target.value;
                                  setNewQuestion({
                                    ...newQuestion,
                                    options: newOptions,
                                  });
                                }}
                                className="flex-1 p-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Select the radio button next to the correct answer
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-slate-200">
                    <div className="flex space-x-3">
                      <button
                        //  loading={loading}
                        onClick={handleAddQuestion}
                        disabled={false}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Save Question
                      </button>
                      <button
                        onClick={() => setShowAddQuestion(false)}
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {editingQuestion && (
              <div className="fixed inset-0  bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200">
                  <div className="p-4 border-b border-slate-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <Edit className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            Edit Question
                          </h3>
                          <p className="text-slate-600 text-sm">
                            Modify question details
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="text-slate-400  hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <X className="w-5 cursor-pointer h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Question
                        </label>
                        <textarea
                          value={editingQuestion.question}
                          onChange={(e) =>
                            setEditingQuestion({
                              ...editingQuestion,
                              question: e.target.value,
                            })
                          }
                          className="w-full p-3 border cursor-pointer border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Answer Options
                        </label>
                        <div className="space-y-2">
                          {editingQuestion.options.map((option, index) => (
                            <div
                              key={index}
                              className="flex  items-center space-x-3"
                            >
                              <input
                                type="radio"
                                name="editCorrectAnswer"
                                checked={
                                  editingQuestion.correctAnswer === index
                                }
                                onChange={() =>
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    correctAnswer: index,
                                  })
                                }
                                className="w-4 cursor-pointer h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                              />
                              <span className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {String.fromCharCode(65 + index)}
                              </span>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [
                                    ...editingQuestion.options,
                                  ];
                                  newOptions[index] = e.target.value;
                                  setEditingQuestion({
                                    ...editingQuestion,
                                    options: newOptions,
                                  });
                                }}
                                className="flex-1 p-2.5 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          Select the radio button next to the correct answer
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 border-t border-slate-200">
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveQuestion}
                        disabled={loading}
                        className="flex-1 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center shadow-sm"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingQuestion(null)}
                        className="px-5 py-2.5 cursor-pointer bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
