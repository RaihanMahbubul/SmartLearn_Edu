
import { Course } from './types.ts';

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Courses', path: '/courses' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'react-mastery',
    title: 'React Mastery: From Novice to Ninja',
    description: 'A comprehensive guide to modern React development.',
    longDescription: 'Dive deep into the React ecosystem. Learn hooks, context, state management with Redux, and build complex, scalable applications. This course is perfect for both beginners and experienced developers looking to sharpen their skills.',
    instructor: 'Jane Doe',
    price: 49.99,
    thumbnail: 'https://picsum.photos/seed/react/600/400',
    videos: [
      { id: 'v1', title: 'Introduction to React', youtubeId: 'SqcY0GlETPk' },
      { id: 'v2', title: 'Components and Props', youtubeId: 'Y2hgEGPzTZY' },
      { id: 'v3', title: 'State and Lifecycle', youtubeId: 'o_WPkZzwyCM' },
    ],
    materials: [
      { id: 'm1', title: 'Course Slides (PDF)', url: '#' },
      { id: 'm2', title: 'Project Source Code (Zip)', url: '#' },
    ],
    feed: [
      { id: 'f1', author: 'Jane Doe', content: 'Welcome everyone! The first module is now live.', timestamp: '2 days ago' },
    ],
    exams: [
      {
        id: 'e1',
        title: 'Mid-term Exam (MCQ)',
        description: 'Test your knowledge on core React concepts covered in the first half of the course.',
        type: 'mcq',
        duration: 5, // 5 minute timer
        liveWindowStart: new Date(Date.now() - 86400000).toISOString(), // Starts 24 hours ago
        liveWindowEnd: new Date(Date.now() + 86400000 * 7).toISOString(), // Ends in 7 days
        instructions: `
          <p>Please read the following instructions carefully before starting the exam:</p>
          <ul class="list-disc list-inside space-y-2 my-4">
              <li>This is a timed exam. You will have <strong>5 minutes</strong> to complete it.</li>
              <li>The timer will start as soon as you click 'Confirm & Start Exam'.</li>
              <li>You cannot pause the timer once it has started.</li>
              <li>Make sure you have a stable internet connection.</li>
              <li>All questions are multiple-choice. Select the best answer for each question.</li>
          </ul>
          <p>Good luck!</p>
        `,
        questions: [
          { id: 'q1', text: 'What is JSX?', options: ['A JavaScript syntax extension', 'A templating engine', 'A CSS preprocessor'], answer: 'A JavaScript syntax extension' },
          { id: 'q2', text: 'Which hook is used for state management in functional components?', options: ['useEffect', 'useState', 'useContext'], answer: 'useState' },
        ],
      },
      {
        id: 'e2',
        title: 'Final Project (Descriptive)',
        description: 'Apply your skills to build a small application and explain key architectural decisions.',
        type: 'descriptive',
        questions: [
          { id: 'q3', text: 'Describe the virtual DOM and its benefits.' },
          { id: 'q4', text: 'Build a simple to-do list application using React hooks.' }
        ]
      },
      {
        id: 'e3',
        title: 'Pop Quiz: Hooks (Live)',
        description: 'A quick quiz on React Hooks. Only available for a short time!',
        type: 'mcq',
        duration: 2,
        liveWindowStart: '2099-01-01T10:00:00Z', // Future start date
        liveWindowEnd: '2099-01-01T22:00:00Z',   // Future end date
        questions: [
          { id: 'q5', text: 'What does `useReducer` return?', options: ['A state value and a dispatch function', 'Just a state value', 'A reducer function'], answer: 'A state value and a dispatch function' },
        ],
      },
    ],
  },
  {
    id: 'tailwind-design',
    title: 'Tailwind CSS for Modern UI Design',
    description: 'Build beautiful, responsive UIs with utility-first CSS.',
    longDescription: 'Forget writing custom CSS. With Tailwind, you can style your components directly in your markup. This course covers everything from basic utilities to advanced customization, JIT compilation, and responsive design.',
    instructor: 'John Smith',
    price: 29.99,
    thumbnail: 'https://picsum.photos/seed/tailwind/600/400',
    videos: [
      { id: 'v1', title: 'Getting Started with Tailwind', youtubeId: 'pfaSUYaSgPo' },
    ],
    materials: [
      { id: 'm1', title: 'Cheatsheet', url: '#' },
    ],
    feed: [],
    exams: [],
  },
  {
    id: 'firebase-fullstack',
    title: 'Firebase for Full-Stack Web Apps',
    description: 'Leverage Firebase for auth, database, and hosting.',
    longDescription: 'Learn to build serverless applications with Google\'s Firebase. We\'ll cover Authentication, Firestore for real-time data, Cloud Functions for backend logic, and Hosting for deploying your app globally.',
    instructor: 'Emily White',
    price: 59.99,
    thumbnail: 'https://picsum.photos/seed/firebase/600/400',
    videos: [],
    materials: [],
    feed: [],
    exams: [],
  },
];