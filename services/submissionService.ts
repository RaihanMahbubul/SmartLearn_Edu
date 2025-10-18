import { ExamSubmission } from '../types.ts';

const SUBMISSION_STORAGE_KEY = 'smartlearn-submissions';

// Function to get all submissions
export const getSubmissions = (): ExamSubmission[] => {
  try {
    const data = localStorage.getItem(SUBMISSION_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse submissions", error);
    return [];
  }
};

// Function to save all submissions
const saveSubmissions = (submissions: ExamSubmission[]): void => {
  try {
    localStorage.setItem(SUBMISSION_STORAGE_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error("Failed to save submissions", error);
  }
};

// Function to add a submission
export const addSubmission = (submission: ExamSubmission): void => {
  const allSubmissions = getSubmissions();
  const existingIndex = allSubmissions.findIndex(s => s.id === submission.id);
  if (existingIndex > -1) {
    allSubmissions[existingIndex] = submission;
  } else {
    allSubmissions.push(submission);
  }
  saveSubmissions(allSubmissions);
};

// Function to get submissions for a specific exam
export const getSubmissionsForExam = (examId: string): ExamSubmission[] => {
  return getSubmissions().filter(s => s.examId === examId);
};


const initializeMockSubmissions = () => {
  const existingSubmissions = getSubmissions();
  if (existingSubmissions.length === 0) {
    const mockSubmissions: ExamSubmission[] = [
      // Submissions for 'e1' - Mid-term Exam
      { id: 'e1-user1', examId: 'e1', userId: 'user1', userName: 'Alice', answers: { q1: 'A JavaScript syntax extension', q2: 'useState' }, startTime: new Date(Date.now() - 120000).toISOString(), endTime: new Date(Date.now() - 65000).toISOString(), score: 100, onLeaderboard: true },
      { id: 'e1-user2', examId: 'e1', userId: 'user2', userName: 'Bob', answers: { q1: 'A templating engine', q2: 'useState' }, startTime: new Date(Date.now() - 180000).toISOString(), endTime: new Date(Date.now() - 110000).toISOString(), score: 50, onLeaderboard: true },
      { id: 'e1-user3', examId: 'e1', userId: 'user3', userName: 'Charlie', answers: { q1: 'A JavaScript syntax extension', q2: 'useState' }, startTime: new Date(Date.now() - 90000).toISOString(), endTime: new Date(Date.now() - 10000).toISOString(), score: 100, onLeaderboard: true },
      { id: 'e1-user5', examId: 'e1', userId: 'user5', userName: 'Edward', answers: { q1: 'A JavaScript syntax extension', q2: 'useContext' }, startTime: new Date(Date.now() - 150000).toISOString(), endTime: new Date(Date.now() - 80000).toISOString(), score: 50, onLeaderboard: true },
      // Submission outside the leaderboard window (hypothetically)
      { id: 'e1-user4', examId: 'e1', userId: 'user4', userName: 'Diana', answers: { q1: 'A JavaScript syntax extension', q2: 'useEffect' }, startTime: new Date(Date.now() - 200000).toISOString(), endTime: new Date(Date.now() - 150000).toISOString(), score: 50, onLeaderboard: false },
    ];
    saveSubmissions(mockSubmissions);
  }
};

initializeMockSubmissions();