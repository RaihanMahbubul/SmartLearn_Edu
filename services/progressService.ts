import { Course, CourseProgress } from '../types.ts';

const STORAGE_KEY = 'smartlearn-progress';

// Helper function to get all progress data from localStorage
const getAllProgress = (): Record<string, CourseProgress> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to parse progress data from localStorage", error);
    return {};
  }
};

// Helper function to save all progress data to localStorage
const saveAllProgress = (allProgress: Record<string, CourseProgress>): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error("Failed to save progress data to localStorage", error);
  }
};

// Get progress for a specific course
export const getCourseProgress = (courseId: string): CourseProgress => {
  const allProgress = getAllProgress();
  return allProgress[courseId] || { videos: [], materials: [], exams: [] };
};

// Get IDs of all courses with any progress
export const getEnrolledCourseIds = (): string[] => {
  const allProgress = getAllProgress();
  return Object.keys(allProgress);
};


// Toggle the completion status of an item
export const toggleItemCompletion = (
  courseId: string,
  itemType: keyof CourseProgress,
  itemId: string
): void => {
  const allProgress = getAllProgress();
  const courseProgress = allProgress[courseId] || { videos: [], materials: [], exams: [] };

  const items = courseProgress[itemType];
  const itemIndex = items.indexOf(itemId);

  if (itemIndex > -1) {
    // Item is already completed, so remove it (mark as incomplete)
    items.splice(itemIndex, 1);
  } else {
    // Item is not completed, so add it
    items.push(itemId);
  }
  
  courseProgress[itemType] = items;
  allProgress[courseId] = courseProgress;
  saveAllProgress(allProgress);
};

// Calculate the overall progress percentage for a course
export const calculateProgressPercentage = (
  course: Course,
  progress: CourseProgress
): number => {
  const totalItems = course.videos.length + course.materials.length + course.exams.length;
  if (totalItems === 0) {
    // If a course has no trackable items, progress is 0.
    return 0;
  }

  const completedItems = progress.videos.length + progress.materials.length + progress.exams.length;

  return (completedItems / totalItems) * 100;
};