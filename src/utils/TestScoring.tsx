// // utils/TestScoring.ts

// import { mockQuestions } from "@/lib/Mockdata";
// export interface TestResult {
//   score: number;
//   timeTaken: string;
//   testId: number;
//   dateCompleted: string;
//   percentage: number;
//   correctAnswers: number;
//   totalQuestions: number;
// }

// export const calculateTestResults = (
//   testId: number,
//   answers: Record<number, number>,
//   timeTakenInSeconds: number
// ): TestResult => {
//   const questions = mockQuestions[testId] || [];
//   let correctAnswers = 0;

//   // questions.forEach((question) => {
//   //   const userAnswer = answers[question.id];
//   //   if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
//   //     correctAnswers++;
//   //   }
//   // });
//   questions.forEach((question, index) => {
//   const userAnswer = answers[index];
//   if (userAnswer !== undefined && userAnswer === question.correctAnswer) {
//     correctAnswers++;
//   }
// });

//   const totalQuestions = questions.length;
//   const percentage = Math.round((correctAnswers / totalQuestions) * 100);
//   const minutes = Math.floor(timeTakenInSeconds / 60);
//   const seconds = timeTakenInSeconds % 60;
//   const timeTaken = `${minutes.toString().padStart(2, "0")}:${seconds
//     .toString()
//     .padStart(2, "0")}`;

//   return {
//     testId,
//     score: correctAnswers,
//     timeTaken,
//     dateCompleted: new Date().toLocaleDateString(),
//     percentage,
//     correctAnswers,
//     totalQuestions,
//   };
// };
