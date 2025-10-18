import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { MOCK_COURSES } from '../constants.ts';
import { getEnrolledCourseIds } from '../services/progressService.ts';
import CourseCard from '../components/CourseCard.tsx';

const MyCoursesPage: React.FC = () => {
  const { user, setAuthModalOpen, setAuthModalMessage } = useAuth();

  if (!user) {
    return (
      <div className="text-center p-8 bg-gray-800/50 rounded-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4">My Courses</h1>
        <p className="text-gray-300 mb-6">Please log in to view your enrolled courses.</p>
        <button 
          onClick={() => {
            setAuthModalMessage(`Log in to view your courses.`);
            setAuthModalOpen(true);
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Login or Sign Up
        </button>
      </div>
    );
  }

  const enrolledCourseIds = getEnrolledCourseIds();
  const enrolledCourses = MOCK_COURSES.filter(course => enrolledCourseIds.includes(course.id));

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        My Courses
      </h1>
      {enrolledCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-800/50 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-4">You haven't started any courses yet.</h2>
          <p className="text-gray-400 mb-6">Explore our catalog and begin your learning journey today!</p>
          <Link
            to="/courses"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Explore Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCoursesPage;