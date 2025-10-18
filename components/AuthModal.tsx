import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMessage }) => {
  const [view, setView] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, sendPasswordReset } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setMessage('');
      setEmail('');
      setPassword('');
      setView('login');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (view === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
        await sendPasswordReset(email);
        setMessage('Password reset email sent. Please check your inbox.');
    } catch (err: any) {
        setError(err.message || 'An error occurred.');
    } finally {
        setLoading(false);
    }
  };

  const renderContent = () => {
    if (view === 'reset') {
      return (
        <>
          <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Reset Password
          </h2>
          <p className="text-center text-gray-400 mb-6">Enter your email to get a reset link</p>

          {message && <p className="text-center text-green-300 mb-4 bg-green-900/50 p-3 rounded-md">{message}</p>}
          {error && <p className="text-center text-red-400 mb-4 bg-red-900/50 p-3 rounded-md">{error}</p>}
          
          <form onSubmit={handleResetSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-3" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Spinner /> : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            <button onClick={() => setView('login')} className="font-medium text-cyan-400 hover:text-cyan-300">
              Back to Login
            </button>
          </p>
        </>
      );
    }

    // Login or Register view
    return (
      <>
        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          {view === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-gray-400 mb-6">{view === 'login' ? 'Sign in to continue' : 'Join SmartLearn today'}</p>

        {initialMessage && <p className="text-center text-cyan-300 mb-4 bg-cyan-900/50 p-3 rounded-md">{initialMessage}</p>}
        {error && <p className="text-center text-red-400 mb-4 bg-red-900/50 p-3 rounded-md">{error}</p>}

        <form onSubmit={handleAuthSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-3" 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password"className="block text-sm font-medium text-gray-300">Password</label>
              {view === 'login' && (
                  <button type="button" onClick={() => setView('reset')} className="text-xs font-medium text-cyan-400 hover:text-cyan-300">
                      Forgot Password?
                  </button>
              )}
            </div>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)} 
              required
              className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 text-white p-3" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner /> : (view === 'login' ? 'Login' : 'Register')}
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-6">
          {view === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setView(view === 'login' ? 'register' : 'login')} className="font-medium text-cyan-400 hover:text-cyan-300">
            {view === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </>
    );
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md p-8 m-4 relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthModal;