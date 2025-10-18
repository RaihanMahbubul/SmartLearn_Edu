export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  price: number;
  thumbnail: string;
  videos: Video[];
  materials: Material[];
  feed: FeedPost[];
  exams: Exam[];
}

export interface Video {
  id: string;
  title:string;
  youtubeId: string;
}

export interface Material {
  id: string;
  title: string;
  url: string;
}

export interface FeedPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  instructions?: string; // e.g., HTML content for pre-exam instructions
  type: 'mcq' | 'descriptive';
  questions: Question[];
  duration?: number; // Optional: duration in minutes
  liveWindowStart?: string; // e.g., '2023-10-26T10:00:00Z'
  liveWindowEnd?: string;   // e.g., '2023-10-26T22:00:00Z'
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  answer?: string;
}

export interface CourseProgress {
  videos: string[];
  materials: string[];
  exams: string[];
}

export interface ExamSubmission {
  id: string; // Composite key like `examId-userId`
  examId: string;
  userId: string;
  userName: string;
  answers: Record<string, string>;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  score: number; // Percentage score
  onLeaderboard: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  timeTaken: number; // in seconds
}