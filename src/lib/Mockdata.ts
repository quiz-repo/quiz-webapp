
// interface Question {
//   id: number;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//    difficulty?: "Easy" | "Medium" | "Hard";
// }

// interface Test {
//   id: number;
//   title: string;
//   subject: string;
//   duration: number;
//   questions: number;
//   difficulty: string;
//   status: string;
//   description: string;
//   instructions: string[];
// }

// type QuestionsMap = {
//   [key: number]: Question[];
// };

// export const mockTests: Test[] = [
//   {
//     id: 1,
//     title: "JavaScript Fundamentals",
//     subject: "Programming",
//     duration: 10,
//     questions: 3,
//     difficulty: "Intermediate",
//     status: "active",
//     description:
//       "Test your knowledge of JavaScript basics including variables, functions, and DOM manipulation.",
//     instructions: [
//       "Read each question carefully before selecting your answer",
//       "You can navigate between questions using the Next/Previous buttons",
//       "Once you submit, you cannot change your answers",
//       "Make sure you have a stable internet connection",
//       "The test will auto-submit when time expires",
//     ],
//   },
//   {
//     id: 2,
//     title: "React Components & Hooks",
//     subject: "Frontend Development",
//     duration: 5,
//     questions: 2,
//     difficulty: "Advanced",
//     status: "active",
//     description:
//       "Advanced concepts in React including hooks, state management, and component lifecycle.",
//     instructions: [
//       "This test covers advanced React concepts",
//       "Code snippets will be provided for some questions",
//       "Pay attention to React best practices",
//       "Consider performance implications in your answers",
//       "Time management is crucial for this test",
//     ],
//   },
//   {
//     id: 3,
//     title: "Database Design Principles",
//     subject: "Backend Development",
//     duration: 15,
//     questions: 2,
//     difficulty: "Intermediate",
//     status: "active",
//     description:
//       "Database normalization, relationships, and SQL query optimization techniques.",
//     instructions: [
//       "Questions include both theoretical and practical aspects",
//       "SQL queries may need to be analyzed",
//       "Consider database performance in your answers",
//       "Normalization concepts are heavily tested",
//       "Take your time to read each question thoroughly",
//     ],
//   },
// ];

// export const mockQuestions: QuestionsMap = {
//   1: [
//     {
//       id: 1,
//       question: "What is the correct way to declare a variable in JavaScript?",
//       options: [
//         "var myVariable = 'Hello';",
//         "variable myVariable = 'Hello';",
//         "v myVariable = 'Hello';",
//         "declare myVariable = 'Hello';",
//       ],
//       correctAnswer: 0,
//     },
//     {
//       id: 2,
//       question:
//         "Which method is used to add an element to the end of an array?",
//       options: ["append()", "push()", "add()", "insert()"],
//       correctAnswer: 1,
//     },
//     { 
//       id: 3,
//       question: "What does DOM stand for?",
//       options: [
//         "Document Object Model",
//         "Data Object Management",
//         "Dynamic Object Method",
//         "Document Oriented Markup",
//       ],
//       correctAnswer: 0,
//     },
//   ],
//   2: [
//     {
//       id: 1,
//       question: "Which hook is used for managing component state in React?",
//       options: ["useEffect", "useState", "useContext", "useReducer"],
//       correctAnswer: 0,
//     },
//     {
//       id: 2,
//       question: "What is the purpose of useEffect hook?",
//       options: [
//         "To manage state",
//         "To handle side effects",
//         "To create context",
//         "To optimize performance",
//       ],
//       correctAnswer: 0,
//     },
//   ],
//   3: [
//     {
//       id: 1,
//       question: "What is database normalization?",
//       options: [
//         "A process to eliminate data redundancy",
//         "A method to increase database size",
//         "A technique to slow down queries",
//         "A way to backup data",
//       ],
//       correctAnswer: 0,
//     },
//         {
//       id: 2,
//       question: "What is databaseh vikas normalization?",
//       options: [
//         "A proces hs to eliminate data redundancy",
//         "A method  hto increase database size",
//         "A technique to slow down queries",
//         "A way to backup data",
//       ],
//       correctAnswer: 1,
//     },
//   ],
// };
