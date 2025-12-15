import React from "react";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  Award,
  Users,
  Edit,
  X,
  Upload,
} from "lucide-react";
// import { toast } from "react-toastify";
// import AdminModal from "../components/modals/AdminModal";
// import TestAnalysis from "../components/TestAnalysis";
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
  createdAt?: any;
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

interface TestAnalytics {
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
}

interface TestManagementProps {
  tests: Test[];
  selectedTest: Test | null;
  setSelectedTest: (test: Test | null) => void;
  handleDeleteTest: (testId: string) => Promise<void>;
  handleAddTest: () => Promise<void>;
  loading: boolean;
  showAddTest: boolean;
  setShowAddTest: (show: boolean) => void;
  onClose: () => void;
  newTest: NewTest;
  setNewTest: (test: NewTest) => void;
  handleInstructionChange: (index: number, value: string) => void;
  addInstruction: () => void;
  removeInstruction: (index: number) => void;
  showAddQuestion: boolean;
  setShowAddQuestion: (show: boolean) => void;
  newQuestion: NewQuestion;
  setNewQuestion: (question: NewQuestion) => void;
  onSelect: (option: string, index: number) => void;
  handleAddQuestion: () => Promise<void>;
  handleEditQuestion: (question: Question) => void;
  handleSaveQuestion: () => Promise<void>;
  handleDeleteQuestion: (questionId: string) => Promise<void>;
  filteredQuestions: Question[];
  editingQuestion: Question | null;
  setEditingQuestion: (question: Question | null) => void;
  setAnalysisTestId: (testId: string | null) => void;
  analysisTestId: string | null;
  testAnalytics: { [key: string]: TestAnalytics };
  pendingDeleteTestId: string | null;
  setPendingDeleteTestId: (testId: string | null) => void;
  isNavigationModalVisible: boolean;
  setIsNavigationModalVisible: (visible: boolean) => void;
  users?: any;
  // users?: any;
  handleFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  csvData?: Record<string, string>[];
  setCsvData?: (data: Record<string, string>[]) => void;
  handleBulkAddQuestions?: (questions: NewQuestion[]) => Promise<void>;
  pendingQuestions?: NewQuestion[];
  setPendingQuestions?: (questions: NewQuestion[]) => void;
  handleUpdateTest?: () => Promise<void>;
  handleEditTestClick?: (test: Test) => void;
  isEditingTest?: boolean;
}

const TestManagement: React.FC<TestManagementProps> = ({
  tests,
  selectedTest,
  setSelectedTest,
  handleDeleteTest,
  handleAddTest,
  loading,
  showAddTest,
  setShowAddTest,
  onClose,
  newTest,
  setNewTest,
  handleInstructionChange,
  addInstruction,
  removeInstruction,
  showAddQuestion,
  setShowAddQuestion,
  newQuestion,
  setNewQuestion,
  onSelect,
  handleAddQuestion,
  handleEditQuestion,
  handleSaveQuestion,
  handleDeleteQuestion,
  filteredQuestions,
  editingQuestion,
  setEditingQuestion,
  // setAnalysisTestId,
  analysisTestId,
  testAnalytics,
  setPendingDeleteTestId,
  setIsNavigationModalVisible,
  users,
  handleFileUpload,
  csvData = [],
  setCsvData,
  handleBulkAddQuestions,
  pendingQuestions = [],
  setPendingQuestions,
  handleUpdateTest,
  handleEditTestClick,
  isEditingTest = false,
}) => {
  console.log(filteredQuestions, 'dfgfgdfg')
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Test Management
          </h1>
          <p className="text-slate-600">Create, edit, and manage your tests</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddTest(true)}
            disabled={loading}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium flex items-center transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-50"
          >
            <Plus className="w-5 h-5 mr-2" /> Create Test
          </button>

          {/* <label className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium flex items-center transition-colors shadow-lg shadow-green-500/25">
            <Upload className="w-5 h-5 mr-2" />
            Upload CSV
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".csv"
            />
          </label> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center">
              <FileText className="mr-3 text-blue-600" /> All Tests (
              {tests.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...tests]
                .sort((a, b) => {
                  const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.created).getTime();
                  const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.created).getTime();
                  return dateB - dateA;
                })
                .map((test) => (
                  <div
                    key={test.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${selectedTest?.id === test.id
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
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${test.status?.toLowerCase() === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                              }`}
                          >
                            {test.status.charAt(0).toUpperCase() +
                              test.status.slice(1).toLowerCase()}
                          </span>
                          {/* <button
                          className="px-3 cursor-pointer py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                          onClick={() => setAnalysisTestId(test.id)}
                        >
                          Analyse
                        </button> */}
                          {/* {analysisTestId && (
                          <TestAnalysis
                            testId={analysisTestId}
                            onClose={() => setAnalysisTestId(null)}
                          />
                        )} */}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTestClick?.(test);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Test"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPendingDeleteTestId(test.id);
                            setIsNavigationModalVisible(true);
                          }}
                          disabled={loading}
                          className="text-red-400 cursor-pointer hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <Edit2 className="mr-3 text-blue-600" />{" "}
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
                  <Plus className="w-4 h-4 mr-1" /> Add Question
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
                          onClick={() => handleDeleteQuestion(question.id)}
                          disabled={loading}
                          className="text-red-400 cursor-pointer hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
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
                          className={`text-xs p-3 rounded-lg border transition-all ${optIndex === question.correctAnswer
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

      {showAddTest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">
                {isEditingTest ? "Edit Test" : "Create New Test"}
              </h2>
              <button
                onClick={onClose}
                className=" cursor-pointer text-slate-400 hover:text-slate-600 transition"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  type="text"
                  value={newTest.title}
                  onChange={(e) =>
                    setNewTest({ ...newTest, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Subject
                </label>
                <input
                  type="text"
                  value={newTest.subject}
                  onChange={(e) =>
                    setNewTest({ ...newTest, subject: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newTest.duration}
                  onChange={(e) =>
                    setNewTest({ ...newTest, duration: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={newTest.questions}
                  onChange={(e) =>
                    setNewTest({ ...newTest, questions: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Difficulty
                </label>
                <Select
                  value={newTest.difficulty}
                  onChange={(value) =>
                    setNewTest({ ...newTest, difficulty: value })
                  }
                  className="select-dropdown"
                  options={[
                    { value: "Beginner", label: "Beginner" },
                    { value: "Intermediate", label: "Intermediate" },
                    { value: "Advanced", label: "Advanced" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select
                  value={newTest.status}
                  onChange={(value) =>
                    setNewTest({ ...newTest, status: value })
                  }
                  className="mt-1 block w-full rounded-md [&_.ant-select-selector]:rounded-md [&_.ant-select-selector]:px-3 [&_.ant-select-selector]:py-2"
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "Draft", label: "Draft" },
                  ]}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  value={newTest.description}
                  onChange={(e) =>
                    setNewTest({ ...newTest, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  rows={3}
                ></textarea>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Instructions
                </label>
                {newTest.instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-2 items-center mb-2">
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) =>
                        handleInstructionChange(index, e.target.value)
                      }
                      className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                    />
                    {newTest.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInstruction}
                  className="cursor-pointer mt-2 text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus size={14} className="mr-1" /> Add Instruction
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-5 flex justify-between items-center">
              <div className="text-sm text-slate-500">
                {pendingQuestions.length > 0 && (
                  <span className="text-emerald-600 font-medium flex items-center">
                    <FileText className="w-4 h-4 mr-1" /> {pendingQuestions.length} questions attached
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <label className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-5 py-3 rounded-xl font-medium flex items-center transition-colors shadow-lg shadow-green-500/25">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload CSV
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".csv"
                  />
                </label>
                <button
                  type="button"
                  onClick={onClose}
                  className=" cursor-pointer px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={isEditingTest && handleUpdateTest ? handleUpdateTest : handleAddTest}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isEditingTest ? "Update Test" : "Create Test"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {showAddQuestion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Add Question
              </h2>
              <button
                onClick={() => setShowAddQuestion(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Question
                </label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, question: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm p-2"
                  rows={3}
                ></textarea>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Options
                </label>
                <div className="space-y-2">
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newQuestion.correctAnswer === index}
                        onChange={() => onSelect(option, index)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion({
                            ...newQuestion,
                            options: newOptions,
                          });
                        }}
                        className="block w-full rounded-md border border-slate-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm p-2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddQuestion(false)}
                  className="px-5 py-2 text-sm cursor-pointer bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  disabled={loading}
                  className="px-5 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Add Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingQuestion && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Edit Question
              </h2>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-5">
              {/* Question */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
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
                  className="mt-1 block w-full rounded-xl border border-slate-300 shadow-sm 
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-500 px-4 py-3 text-sm"
                  rows={3}
                ></textarea>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Options
                </label>
                <div className="space-y-3">
                  {editingQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={editingQuestion.correctAnswer === index}
                        onChange={() =>
                          setEditingQuestion({
                            ...editingQuestion,
                            correctAnswer: index,
                          })
                        }
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded-full cursor-pointer"
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
                        className="flex-1 rounded-xl border border-slate-300 shadow-sm 
                             focus:border-blue-500 focus:ring-2 focus:ring-blue-500 
                             px-4 py-2 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="px-5 py-2.5 cursor-pointer bg-slate-100 text-slate-700 
                     rounded-xl hover:bg-slate-200 transition-colors border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuestion}
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl 
                     hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {csvData.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Preview CSV Import
              </h2>
              <button
                onClick={() => setCsvData?.([])}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-auto border rounded-xl">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-medium text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-6 py-4">Question</th>
                    <th className="px-6 py-4">Option A</th>
                    <th className="px-6 py-4">Option B</th>
                    <th className="px-6 py-4">Option C</th>
                    <th className="px-6 py-4">Option D</th>
                    <th className="px-6 py-4">Correct Answer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {csvData.map((row, index) => {
                    // Helper to map row to clean data
                    const processRow = (r: any) => {
                      // Attempt to match keys more aggressively, especially uppercase with spaces
                      const q = r.QUESTION || r.Question || r.question || r['Question Text'] || (Object.values(r)[0] as string) || "";

                      const o1 = r['OPTION A'] || r['Option A'] || r.OptionA || r.option1 || r.Option1 || r['Option 1'] || r.A || r.a || "";
                      const o2 = r['OPTION B'] || r['Option B'] || r.OptionB || r.option2 || r.Option2 || r['Option 2'] || r.B || r.b || "";
                      const o3 = r['OPTION C'] || r['Option C'] || r.OptionC || r.option3 || r.Option3 || r['Option 3'] || r.C || r.c || "";
                      const o4 = r['OPTION D'] || r['Option D'] || r.OptionD || r.option4 || r.Option4 || r['Option 4'] || r.D || r.d || "";

                      let ans = 0;
                      const rawAns = r['CORRECT ANSWER'] || r['Correct Answer'] || r.correctAnswer || r.CorrectAnswer || r.answer || r.Answer || r.ANSWER;

                      if (rawAns !== undefined && rawAns !== null) {
                        const s = String(rawAns).trim().toUpperCase();
                        if (['A', '1', 'OPTION A'].some(x => s === x || s.endsWith(x))) ans = 0;
                        else if (['B', '2', 'OPTION B'].some(x => s === x || s.endsWith(x))) ans = 1;
                        else if (['C', '3', 'OPTION C'].some(x => s === x || s.endsWith(x))) ans = 2;
                        else if (['D', '4', 'OPTION D'].some(x => s === x || s.endsWith(x))) ans = 3;
                        else {
                          const n = Number(rawAns);
                          if (!isNaN(n)) ans = n;
                        }
                      }
                      return { q, options: [o1, o2, o3, o4], ans };
                    };

                    const { q, options, ans } = processRow(row);

                    return (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-slate-900 line-clamp-2">{q}</td>
                        <td className="px-6 py-4">{options[0]}</td>
                        <td className="px-6 py-4">{options[1]}</td>
                        <td className="px-6 py-4">{options[2]}</td>
                        <td className="px-6 py-4">{options[3]}</td>
                        <td className="px-6 py-4 font-medium text-emerald-600">
                          {['A', 'B', 'C', 'D'][ans] || ans}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                onClick={() => setCsvData?.([])}
                className="px-5 py-2.5 cursor-pointer bg-slate-100 text-slate-700 
                     rounded-xl hover:bg-slate-200 transition-colors border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (handleBulkAddQuestions) {
                    const formattedQuestions: NewQuestion[] = csvData.map(row => {
                      const q = row.QUESTION || row.Question || row.question || row['Question Text'] || (Object.values(row)[0] as string) || "";

                      const o1 = row['OPTION A'] || row['Option A'] || row.OptionA || row.option1 || row.Option1 || row['Option 1'] || row.A || row.a || "";
                      const o2 = row['OPTION B'] || row['Option B'] || row.OptionB || row.option2 || row.Option2 || row['Option 2'] || row.B || row.b || "";
                      const o3 = row['OPTION C'] || row['Option C'] || row.OptionC || row.option3 || row.Option3 || row['Option 3'] || row.C || row.c || "";
                      const o4 = row['OPTION D'] || row['Option D'] || row.OptionD || row.option4 || row.Option4 || row['Option 4'] || row.D || row.d || "";

                      let ans = 0;
                      const rawAns = row['CORRECT ANSWER'] || row['Correct Answer'] || row.correctAnswer || row.CorrectAnswer || row.answer || row.Answer || row.ANSWER;

                      if (rawAns !== undefined && rawAns !== null) {
                        const s = String(rawAns).trim().toUpperCase();
                        if (['A', '1', 'OPTION A'].some(x => s === x || s.endsWith(x))) ans = 0;
                        else if (['B', '2', 'OPTION B'].some(x => s === x || s.endsWith(x))) ans = 1;
                        else if (['C', '3', 'OPTION C'].some(x => s === x || s.endsWith(x))) ans = 2;
                        else if (['D', '4', 'OPTION D'].some(x => s === x || s.endsWith(x))) ans = 3;
                        else {
                          const n = Number(rawAns);
                          if (!isNaN(n)) ans = n;
                        }
                      }

                      return {
                        question: q,
                        options: [o1, o2, o3, o4],
                        correctAnswer: ans,
                        type: "multiple-choice" as const
                      };
                    }).filter(q => q.question);

                    if (showAddTest && setPendingQuestions) {
                      // We are in "Create Test" mode
                      setPendingQuestions(formattedQuestions);
                      setCsvData?.([]);
                      // toast.success("Questions attached!"); // Toast might be behind modal?
                    } else if (handleBulkAddQuestions) {
                      // We are in "Test Management" mode (adding to existing test)
                      handleBulkAddQuestions(formattedQuestions);
                    }
                  }
                }}
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl 
                     hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Confirm Import ({csvData.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
