
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-700">
      <h1 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        About SmartLearn
      </h1>
      <div className="max-w-4xl mx-auto text-gray-300 space-y-6">
        <p>
          SmartLearn is a state-of-the-art, responsive web-based learning platform designed to make education accessible, engaging, and effective for everyone, everywhere. Our mission is to break down the barriers to learning by providing high-quality courses and a seamless user experience.
        </p>
        <p>
          Our platform is built on modern technology, featuring a 3D-style interface with soft color gradients that create an immersive and pleasant learning environment. We believe that a great design enhances the learning process, which is why we've focused on creating a simple, intuitive, and user-friendly platform.
        </p>
        <h2 className="text-2xl font-semibold text-cyan-300 pt-4">Our Features</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Diverse Course Catalog:</strong> Explore a wide range of courses from technology to arts, taught by industry experts.</li>
          <li><strong>Interactive Learning:</strong> Engage with course materials, watch high-quality video lectures, and participate in instructor-led feeds.</li>
          <li><strong>Comprehensive Exams:</strong> Test your knowledge with our robust exam system, featuring both objective (MCQ) and creative (descriptive) assessments.</li>
          <li><strong>Secure and Simple:</strong> Easy login with verified email and secure payment options for premium courses.</li>
        </ul>
        <p>
          At SmartLearn, we are committed to continuous improvement and innovation. We are constantly updating our platform and course offerings to ensure our students have the best tools and resources to achieve their learning goals.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
