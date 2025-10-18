
import React from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard.tsx';
import { MOCK_COURSES } from '../constants.ts';

const HomePage: React.FC = () => {
  const featuredCourses = MOCK_COURSES.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20 rounded-xl bg-gradient-to-r from-blue-900/30 via-purple-900/30 to-cyan-900/30 animate-gradient-x">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          Unlock Your Potential
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Join SmartLearn and start your journey towards knowledge and excellence today.
        </p>
        <Link 
          to="/courses"
          className="mt-4 inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          Explore Courses
        </Link>
      </section>

      {/* Featured Courses Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-white">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;