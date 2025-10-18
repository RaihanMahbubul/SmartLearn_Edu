import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './pages/HomePage.tsx';
import CoursesPage from './pages/CoursesPage.tsx';
import CourseDetailPage from './pages/CourseDetailPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import MyCoursesPage from './pages/MyCoursesPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import LeaderboardPage from './pages/LeaderboardPage.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import AuthModal from './components/AuthModal.tsx';

const AppContent: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, authModalMessage, setAuthModalMessage } = useAuth();
    
  const handleClose = () => {
      setAuthModalOpen(false);
      setAuthModalMessage(''); // Clear message on close
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/exam/:examId/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </main>
      <Footer />
      <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={handleClose}
          initialMessage={authModalMessage}
      />
    </div>
  )
}


const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;