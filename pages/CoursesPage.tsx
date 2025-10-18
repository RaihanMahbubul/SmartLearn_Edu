
import React from 'react';
import CourseCard from '../components/CourseCard';
import { MOCK_COURSES } from '../constants';

const CoursesPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        All Courses
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
