"use client";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plus, Edit2, Trash2, Save, X, LogOutIcon, Edit } from "lucide-react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db, setDocByFirebase } from "@/lib/Firebase";
import { useRouter } from "next/navigation";
import ConfirmModal from "../components/modals/ConfirmModal";

// TypeScript interfaces
interface Test {
  id: string;
  title: string;
  subject?: string;
  duration?: number;
  difficulty?: string;
  status: "active" | "draft";
  description?: string;
  instructions?: string[];
  questions: Question[] | number;
  created: string;
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

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<string>("tests");
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
    router.push("/homes");
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

      console.log("Test and associated questions deleted successfully!");
    } catch (error) {
      console.error("Error deleting test:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddQuestion = async (): Promise<void> => {
    if (!newQuestion.question.trim() || !selectedTest) return;
    // const questionId = crypto.randomUUID();
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
      console.log("Question updated successfully!");
    } catch (error) {
      console.error("Error updating question:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete question from Firebase
  // const handleDeleteQuestion = async (questionId: string): Promise<void> => {
  //   if (!selectedTest) return;

  //   setLoading(true);
  //   try {
  //     const updatedTestQuestions = selectedTest.questions.filter(
  //       (question) => question.id !== questionId
  //     );

  //     const testRef = doc(db, "tests", selectedTest.id);
  //     await updateDoc(testRef, {
  //       questions: updatedTestQuestions,
  //     });

  //     // Update state
  //     setSelectedTest((prev) =>
  //       prev ? { ...prev, questions: updatedTestQuestions } : null
  //     );

  //     setQuestions((prevQuestions) =>
  //       prevQuestions.map((test) =>
  //         test.id === selectedTest.id
  //           ? {
  //               ...test,
  //               questions: test.questions.filter(
  //                 (q: any) => q.id !== questionId
  //               ),
  //             }
  //           : test
  //       )
  //     );

  //     console.log("Question deleted successfully!");
  //   } catch (error: any) {
  //     console.error("Error deleting question:", error.message || error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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

    // Update local selected test state
    setSelectedTest((prev) =>
      prev ? { ...prev, questions: updatedTestQuestions } : null
    );

    // Update the global tests state (assuming it's an array of tests)
    setQuestions((prevTests) =>
      prevTests.map((test: any) =>
        test.id === selectedTest.id
          ? { ...test, questions: updatedTestQuestions }
          : test
      )
    );

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
      };


      const docId = await setDocByFirebase(testData);
      const newTestWithId: Test = {
        id: docId,
        ...testData,
        status: (testData.status as "active" | "draft") || "draft",
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
      console.log("Test added successfully!");
    } catch (error) {
      console.error("Error adding test:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-600">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-black text-center">Loading...</p>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "dashboard" && (
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 border border-opacity-20">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Total Tests
                  </h3>
                  <p className="text-3xl font-bold text-cyan-300">
                    {tests.length}
                  </p>
                </div>
                <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 border border-opacity-20">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Total Questions
                  </h3>
                  <p className="text-3xl font-bold text-green-300">
                    {questions.length}
                  </p>
                </div>
                <div className="bg-white bg-opacity-15 backdrop-blur-sm rounded-xl p-6 border border-opacity-20">
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    Active Tests
                  </h3>
                  <p className="text-3xl font-bold text-yellow-300">
                    {tests.filter((t) => t.status === "active").length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tests" && (
            <div className="text-white">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">
                  Tests Management
                </h1>
                <button
                  onClick={() => setShowAddTest(true)}
                  disabled={loading}
                  className="bg-gradient-to-r cursor-pointer from-cyan-500 relative left-[28%] to-purple-500 px-6 py-3 min-w-[140px] font-semibold flex items-center justify-center hover:from-cyan-600 hover:to-purple-600 transition-all text-white shadow-lg disabled:opacity-50 rounded"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Test
                </button>

                <button
                  onClick={() => setIsModalVisible(true)}
                  className="bg-red-500 px-6 py-3 cursor-pointer min-w-[100px] font-semibold flex items-center justify-center hover:bg-red-600 transition-all text-white shadow-lg rounded"
                >
                  <LogOutIcon className="mr-2" />
                  Logout
                </button>

                {isModalVisible && (
                  <ConfirmModal
                    title="Confirm Logout"
                    message="Are you sure you want to logout?"
                    visible={isModalVisible}
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tests List */}
                <div className="backdrop-blur-sm rounded-xl p-6 border-opacity-20">
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    All Tests
                  </h2>
                  <div className="space-y-3">
                    {tests.map((test) => (
                      <div
                        key={test.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedTest?.id === test.id
                            ? "bg-cyan-500 bg-opacity-30 border border-cyan-400"
                            : "hover:bg-opacity-20 border border-opacity-10"
                        }`}
                        onClick={() => setSelectedTest(test)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-white">
                              {test.title}
                            </h3>
                            <p className="text-sm text-purple-100">
                              {Array.isArray(test.questions)
                                ? test.questions.length
                                : typeof test.questions === "number"
                                ? test.questions
                                : 0}{" "}
                              questions • Created: {test.created}
                            </p>

                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs mt-2 font-medium ${
                                test.status === "active"
                                  ? "bg-green-500 bg-opacity-25 text-green-200 border border-green-400"
                                  : "bg-yellow-500 bg-opacity-25 text-yellow-200 border border-yellow-400"
                              }`}
                            >
                              {test.status}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDeleteTestId(test.id);
                              setIsNavigationModalVisible(true);
                            }}
                            disabled={loading}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500 hover:bg-opacity-20 rounded disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <ConfirmModal
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Questions List */}
                <div className="backdrop-blur-sm rounded-xl p-6 border border-opacity-20">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">
                      {selectedTest
                        ? `Questions for "${selectedTest.title}"`
                        : "Select a test to view questions"}
                    </h2>
                    {selectedTest && (
                      <button
                        onClick={() => setShowAddQuestion(true)}
                        disabled={loading}
                        className="bg-gradient-to-r from-green-500 to-cyan-500 px-4 py-2 rounded-lg text-sm font-semibold flex items-center hover:from-green-600 hover:to-cyan-600 transition-all text-white shadow-lg disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Question
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredQuestions.map((question, index) => {
                      console.log(question, "filteredQuestions");
                      return (
                        <div
                          key={question.id}
                          className="p-4 rounded-lg border border-opacity-10"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm text-purple-100">
                              Q{index + 1}
                            </h4>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditQuestion(question)}
                                disabled={loading}
                                className="text-blue-400 hover:text-blue-300 p-1 hover:bg-blue-500 hover:bg-opacity-20 rounded disabled:opacity-50"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  console.log(
                                    "Delete button clicked:",
                                    question.id
                                  );
                                  handleDeleteQuestion(question.id);
                                }}
                                disabled={loading}
                                className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500 hover:bg-opacity-20 rounded disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm mb-2 text-white">
                            {question.question}
                          </p>
                          <div className="space-y-1">
                            {question.options?.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`text-xs p-2 rounded border ${
                                  optIndex === question.correctAnswer
                                    ? "bg-green-500 bg-opacity-25 text-green-200 border-green-400"
                                    : "bg-opacity-10 text-purple-100 border-opacity-20"
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
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
          )}

          {/* Add Test Modal */}
          {showAddTest && (
            <div className="fixed inset-0 bg-purple-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-800 to-blue-700 p-6 rounded-xl w-full max-w-2xl border border-opacity-20 text-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Add New Test</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                  <input
                    type="text"
                    placeholder="Test Title"
                    value={newTest.title}
                    onChange={(e) =>
                      setNewTest({ ...newTest, title: e.target.value })
                    }
                    className="w-full p-3 border border-purple-300 rounded-lg bg-purple-800 bg-opacity-50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <input
                    type="text"
                    placeholder="Subject (e.g., JavaScript, Node-JS, React)"
                    value={newTest.subject}
                    onChange={(e) =>
                      setNewTest({ ...newTest, subject: e.target.value })
                    }
                    className="w-full p-3 border border-purple-300 rounded-lg bg-purple-800 bg-opacity-50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Duration (mins)"
                      value={newTest.duration}
                      onChange={(e) =>
                        setNewTest({ ...newTest, duration: e.target.value })
                      }
                      className="w-full p-3 border border-purple-300 rounded-lg bg-purple-800 bg-opacity-50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                    <input
                      type="number"
                      placeholder="Questions"
                      value={newTest.questions}
                      onChange={(e) =>
                        setNewTest({ ...newTest, questions: e.target.value })
                      }
                      className="w-full p-3 border border-purple-300 rounded-lg bg-purple-800 bg-opacity-50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Difficulty (e.g., Beginner, Intermediate, Advanced)"
                    value={newTest.difficulty}
                    onChange={(e) =>
                      setNewTest({ ...newTest, difficulty: e.target.value })
                    }
                    className="w-full p-3 border border-purple-300 rounded-lg bg-purple-800 bg-opacity-50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                  <input
                    type="text"
                    placeholder="Status (e.g., active, draft)"
                    value={newTest.status}
                    onChange={(e) =>
                      setNewTest({ ...newTest, status: e.target.value })
                    }
                    className="w-full p-3 border border-purple-300 rounded-lg bg-purple-800 bg-opacity-50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                  <textarea
                    placeholder="Description"
                    value={newTest.description}
                    onChange={(e) =>
                      setNewTest({ ...newTest, description: e.target.value })
                    }
                    className="w-full p-3 border border-purple-300 rounded-lg bg-purple-800 bg-opacity-50 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-24 resize-none"
                  />

                  <div>
                    <label className="block mb-2 font-semibold text-sm">
                      Instructions:
                    </label>
                    {newTest.instructions.map((inst, idx) => (
                      <div key={idx} className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={inst}
                          onChange={(e) =>
                            handleInstructionChange(idx, e.target.value)
                          }
                          className="w-full p-2 rounded-lg bg-purple-700 bg-opacity-50 border border-purple-300 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                          placeholder={`Instruction ${idx + 1}`}
                        />
                        {newTest.instructions.length > 1 && (
                          <button
                            onClick={() => removeInstruction(idx)}
                            className="text-red-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addInstruction}
                      className="text-cyan-400 hover:underline mt-2 text-sm"
                    >
                      + Add Instruction
                    </button>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleAddTest}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 px-4 py-2 rounded-lg font-semibold text-white hover:from-green-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Save Test
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Question Modal */}
          {showAddQuestion && (
            <div className="fixed inset-0 bg-purple-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-800 to-blue-700 p-6 rounded-xl w-full max-w-2xl border border-opacity-20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Add New Question
                  </h3>
                  <button
                    onClick={() => setShowAddQuestion(false)}
                    className="text-gray-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <textarea
                    placeholder="Enter your question"
                    value={newQuestion.question}
                    onChange={(e) =>
                      setNewQuestion({
                        ...newQuestion,
                        question: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-purple-300 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-20 resize-none bg-purple-800 bg-opacity-50"
                  />
                  <div className="space-y-2">
                    <label className="text-white font-medium">
                      Answer Options:
                    </label>
                    {newQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={newQuestion.correctAnswer === index}
                          onChange={() => onSelect(option, index)}
                          className="text-cyan-400"
                        />
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
                          className="flex-1 p-2 border border-purple-300 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-purple-800 bg-opacity-50"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleAddQuestion}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 px-4 py-2 rounded-lg font-semibold text-white hover:from-green-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Save Question
                    </button>
                    <button
                      onClick={() => setShowAddQuestion(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Question Modal */}
          {editingQuestion && (
            <div className="fixed inset-0 bg-purple-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gradient-to-br from-purple-800 to-blue-700 p-6 rounded-xl w-full max-w-2xl border-opacity-20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Edit Question
                  </h3>
                  <button
                    onClick={() => setEditingQuestion(null)}
                    className="text-gray-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <textarea
                    value={editingQuestion.question}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-purple-300 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-20 resize-none bg-purple-800 bg-opacity-50"
                  />
                  <div className="space-y-2">
                    <label className="text-white font-medium">
                      Answer Options:
                    </label>
                    {editingQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="editCorrectAnswer"
                          checked={editingQuestion.correctAnswer === index}
                          onChange={() =>
                            setEditingQuestion({
                              ...editingQuestion,
                              correctAnswer: index,
                            })
                          }
                          className="text-cyan-400"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...editingQuestion.options];
                            newOptions[index] = e.target.value;
                            setEditingQuestion({
                              ...editingQuestion,
                              options: newOptions,
                            });
                          }}
                          className="flex-1 p-2 bg-opacity-20 border border-purple-300 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-purple-800 bg-opacity-50"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveQuestion}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-cyan-500 px-4 py-2 rounded-lg font-semibold text-white hover:from-green-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 inline mr-2" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingQuestion(null)}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
