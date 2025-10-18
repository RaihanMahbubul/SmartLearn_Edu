
import React, { useState } from 'react';
import GitHubHelpModal from './GitHubHelpModal';

const Footer: React.FC = () => {
  const [isGitHubModalOpen, setGitHubModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">SmartLearn</h3>
              <p className="text-gray-400">Empowering the next generation of learners through technology.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#/courses" className="text-gray-400 hover:text-cyan-400 transition-colors">Courses</a></li>
                <li><a href="#/my-courses" className="text-gray-400 hover:text-cyan-400 transition-colors">My Courses</a></li>
                <li><a href="#/about" className="text-gray-400 hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#/contact" className="text-gray-400 hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Developer</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setGitHubModalOpen(true)} className="text-gray-400 hover:text-cyan-400 transition-colors text-left">
                    Save to GitHub
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Connect With Us</h4>
              <div className="flex space-x-4">
                {/* SVGs for social icons */}
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                   <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500">
            &copy; {new Date().getFullYear()} SmartLearn Institute. All rights reserved.
          </div>
        </div>
      </footer>
      <GitHubHelpModal isOpen={isGitHubModalOpen} onClose={() => setGitHubModalOpen(false)} />
    </>
  );
};

export default Footer;
