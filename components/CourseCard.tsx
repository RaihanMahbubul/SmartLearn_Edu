import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Course } from '../types';
import { getCourseProgress, calculateProgressPercentage } from '../services/progressService';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const courseProgress = getCourseProgress(course.id);
    const percentage = calculateProgressPercentage(course, courseProgress);
    setProgress(percentage);
  }, [course]);

  return (
    <div className="bg-gray-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-2 transition-all duration-300 border border-gray-700 flex flex-col">
      <img className="w-full h-48 object-cover" src={course.thumbnail} alt={course.title} />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-xl mb-2 text-white">{course.title}</h3>
        <p className="text-gray-400 text-sm mb-2">by {course.instructor}</p>
        <p className="text-gray-300 text-base mb-4 flex-grow">{course.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium text-gray-400">Progress</span>
            <span className="text-xs font-medium text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-cyan-400">${course.price}</span>
          <Link
            to={`/course/${course.id}`}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
