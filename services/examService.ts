import { LeaderboardEntry } from '../types.ts';
import { getSubmissionsForExam } from './submissionService.ts';

// Simulate the API endpoint for fetching a leaderboard
export const getExamLeaderboard = async (examId: string): Promise<LeaderboardEntry[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const submissions = getSubmissionsForExam(examId);

  // Filter for submissions that are eligible for the leaderboard
  const leaderboardSubmissions = submissions.filter(s => s.onLeaderboard);

  // Sort by score (desc) and then by time taken (asc)
  leaderboardSubmissions.sort((a, b) => {
    // 1. Higher score is better
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // 2. Faster time is better
    const timeA = new Date(a.endTime).getTime() - new Date(a.startTime).getTime();
    const timeB = new Date(b.endTime).getTime() - new Date(b.startTime).getTime();
    return timeA - timeB;
  });

  const top100 = leaderboardSubmissions.slice(0, 100);

  // Map to the final LeaderboardEntry format
  return top100.map((sub, index) => {
      const timeTaken = (new Date(sub.endTime).getTime() - new Date(sub.startTime).getTime()) / 1000; // in seconds
      return {
          rank: index + 1,
          name: sub.userName,
          score: sub.score,
          timeTaken: Math.round(timeTaken)
      }
  });
};