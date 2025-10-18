import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_COURSES } from '../constants.ts';
import { Question, CourseProgress, ExamSubmission } from '../types.ts';
import { getCourseProgress, toggleItemCompletion, calculateProgressPercentage } from '../services/progressService.ts';
import { addSubmission } from '../services/submissionService.ts';
import { useAuth } from '../context/AuthContext.tsx';

type Tab = 'videos' | 'materials' | 'feed' | 'exams';

// State for each exam, containing answers, submission status, and score
interface ExamState {
  submitted: boolean;
  answers: Record<string, string>; // questionId: selectedOption
  score: number | null;
}

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const course = MOCK_COURSES.find((c) => c.id === id);
  const [activeTab, setActiveTab] = useState<Tab>('videos');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  
  const [examStates, setExamStates] = useState<Record<string, ExamState>>({});
  const [progress, setProgress] = useState<CourseProgress>({ videos: [], materials: [], exams: [] });
  const [examStarted, setExamStarted] = useState<Record<string, boolean>>({});
  const [examStartTimes, setExamStartTimes] = useState<Record<string, string>>({});
  const [timers, setTimers] = useState<Record<string, number>>({});
  const [viewingInstructionsFor, setViewingInstructionsFor] = useState<string | null>(null);

  // Fix: Replaced NodeJS.Timeout with 'number' for browser compatibility.
  // The return type of setInterval in a browser environment is a number, not a Timeout object.
  const timerRefs = useRef<Record<string, number>>({});

  const { user, setAuthModalOpen, setAuthModalMessage } = useAuth();

  useEffect(() => {
    if (course) {
      const savedProgress = getCourseProgress(course.id);
      setProgress(savedProgress);
    }
     // Cleanup timers on component unmount
    return () => {
      Object.values(timerRefs.current).forEach(clearInterval);
    };
  }, [course?.id]);

  if (!course) {
    return <div className="text-center text-2xl">Course not found.</div>;
  }
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleEnroll = () => {
    if (user) {
       if (!user.email_confirmed_at) {
        alert("Please verify your email before enrolling. Check your inbox for a verification link.");
        return;
      }
      alert('Enrollment feature coming soon!');
    } else {
      setAuthModalMessage("Please log in to enroll in this course.");
      setAuthModalOpen(true);
    }
  };

  const handleAnswerChange = (examId: string, questionId: string, option: string) => {
    setExamStates(prev => {
      const currentExamState = prev[examId] || { submitted: false, answers: {}, score: null };
      const updatedAnswers = {
        ...currentExamState.answers,
        [questionId]: option,
      };
      const updatedExamState = {
        ...currentExamState,
        answers: updatedAnswers,
      };
      return {
        ...prev,
        [examId]: updatedExamState,
      };
    });
  };

  const handleExamSubmit = (examId: string) => {
    if (!user) return; // Should not happen if UI is correct

    // Stop timer if it exists for this exam
    if (timerRefs.current[examId]) {
      clearInterval(timerRefs.current[examId]);
      delete timerRefs.current[examId];
    }
    
    const exam = course.exams.find(e => e.id === examId);
    if (!exam) return;
    
    const currentExamState = examStates[exam.id] || { submitted: false, answers: {}, score: null };

    // Calculate Score
    let correctAnswers = 0;
    exam.questions.forEach(q => {
        if (q.answer && currentExamState.answers[q.id] === q.answer) {
            correctAnswers++;
        }
    });
    const totalQuestions = exam.questions.length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Check leaderboard eligibility
    const isOnLeaderboard = exam.liveWindowEnd ? new Date() <= new Date(exam.liveWindowEnd) : false;

    // Create and save submission record
    const submission: ExamSubmission = {
        id: `${examId}-${user.id}`,
        examId,
        userId: user.id,
        userName: user.user_metadata.displayName || user.email || 'Anonymous',
        answers: currentExamState.answers,
        startTime: examStartTimes[examId],
        endTime: new Date().toISOString(),
        score,
        onLeaderboard: isOnLeaderboard,
    };
    addSubmission(submission);

    setExamStates(prev => ({
        ...prev,
        [examId]: { ...currentExamState, submitted: true, score },
    }));
  };
  
  const beginTimedExam = (examId: string, durationInMinutes: number) => {
    setExamStarted(prev => ({...prev, [examId]: true }));
    setExamStartTimes(prev => ({...prev, [examId]: new Date().toISOString() }));
    const durationInSeconds = durationInMinutes * 60;
    setTimers(prev => ({...prev, [examId]: durationInSeconds }));

    timerRefs.current[examId] = setInterval(() => {
      setTimers(prevTimers => {
        const newTime = prevTimers[examId] - 1;
        if (newTime <= 0) {
          clearInterval(timerRefs.current[examId]);
          handleExamSubmit(examId);
          return { ...prevTimers, [examId]: 0 };
        }
        return { ...prevTimers, [examId]: newTime };
      });
    }, 1000);
  };

  const handleToggleCompletion = (itemType: keyof CourseProgress, itemId: string) => {
    if(!user) {
      setAuthModalMessage("Please log in to track your progress.");
      setAuthModalOpen(true);
      return;
    }
    toggleItemCompletion(course.id, itemType, itemId);
    const updatedProgress = getCourseProgress(course.id);
    setProgress(updatedProgress);
  };

  const progressPercentage = calculateProgressPercentage(course, progress);

  const LockedContent: React.FC<{ tabName: string }> = ({ tabName }) => (
    <div className="text-center p-8 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-2xl font-bold text-cyan-400 mb-2">Content Locked</h3>
      <p className="text-gray-300 mb-4">You need to be logged in to view the course {tabName}.</p>
      <button 
        onClick={() => {
          setAuthModalMessage(`Log in to view the ${tabName}.`);
          setAuthModalOpen(true);
        }}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      >
        Login or Sign Up
      </button>
    </div>
  );

  const renderTabContent = () => {
    if (!user) {
      return <LockedContent tabName={activeTab} />;
    }
    
    switch (activeTab) {
      case 'videos':
        return (
          <div className="space-y-4">
            {course.videos.map((video, index) => {
              const isCompleted = progress.videos.includes(video.id);
              const isActive = activeVideoId === video.id;
              return (
              <div key={video.id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                   <input
                      type="checkbox"
                      id={`video-${video.id}`}
                      checked={isCompleted}
                      onChange={() => handleToggleCompletion('videos', video.id)}
                      className="w-5 h-5 rounded text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-600 cursor-pointer"
                    />
                    <label htmlFor={`video-${video.id}`} className={`ml-3 text-lg font-semibold cursor-pointer transition-colors ${isCompleted ? 'text-gray-500 line-through' : 'text-cyan-300'}`}>
                      {index + 1}. {video.title}
                    </label>
                </div>
                <div className="aspect-w-16 aspect-h-9">
                  {isActive ? (
                    <iframe
                      className="w-full h-full rounded-md"
                      src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                     <div 
                        className="relative w-full h-full rounded-md overflow-hidden cursor-pointer group"
                        onClick={() => setActiveVideoId(video.id)}
                      >
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 group-hover:bg-opacity-20">
                          <svg className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                        </div>
                      </div>
                  )}
                </div>
              </div>
            )})}
          </div>
        );
      case 'materials':
        return (
          <ul className="space-y-3">
            {course.materials.map((material) => {
               const isCompleted = progress.materials.includes(material.id);
               return (
              <li key={material.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                 <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`material-${material.id}`}
                      checked={isCompleted}
                      onChange={() => handleToggleCompletion('materials', material.id)}
                      className="w-5 h-5 rounded text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-600 cursor-pointer"
                    />
                    <label htmlFor={`material-${material.id}`} className={`ml-3 cursor-pointer transition-colors ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>{material.title}</label>
                  </div>
                <a href={material.url} download className="text-cyan-400 hover:text-cyan-300">Download</a>
              </li>
            )})}
          </ul>
        );
      case 'feed':
        return (
          <div className="space-y-4">
            {course.feed.map((post) => (
              <div key={post.id} className="bg-gray-800 p-4 rounded-lg">
                <p className="text-white">{post.content}</p>
                <p className="text-sm text-gray-400 mt-2">- {post.author}, {post.timestamp}</p>
              </div>
            ))}
          </div>
        );
      case 'exams':
        return (
          <div className="space-y-6">
            {course.exams.map((exam) => {
              const isCompleted = progress.exams.includes(exam.id);
              const examState = examStates[exam.id] || { submitted: false, answers: {}, score: null };
              const isExamSubmitted = examState.submitted;
              const isTimed = exam.duration !== undefined;
              const hasStarted = examStarted[exam.id];

              const answeredQuestions = Object.keys(examState.answers).length;
              const totalQuestions = exam.questions.length;
              const examProgressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
              
              let isLive = true;
              let liveWindowMessage = '';
              if (exam.liveWindowStart && exam.liveWindowEnd) {
                const now = new Date();
                const startTime = new Date(exam.liveWindowStart);
                const endTime = new Date(exam.liveWindowEnd);
                isLive = now >= startTime && now < endTime;
                if (!isLive) {
                    liveWindowMessage = `This exam is only available from ${startTime.toLocaleString()} to ${endTime.toLocaleString()}.`;
                }
              }
              
              const hasLeaderboard = isTimed && exam.liveWindowEnd;

              return (
              <div key={exam.id} className="bg-gray-800 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`exam-${exam.id}`}
                          checked={isCompleted}
                          onChange={() => handleToggleCompletion('exams', exam.id)}
                          className="w-5 h-5 rounded text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-600 cursor-pointer mt-1"
                        />
                        <label htmlFor={`exam-${exam.id}`} className={`ml-3 text-xl font-bold cursor-pointer transition-colors ${isCompleted ? 'text-gray-500 line-through' : 'text-cyan-300'}`}>{exam.title}</label>
                    </div>
                    {isTimed && hasStarted && !isExamSubmitted && (
                        <div className="text-lg font-mono bg-gray-700 text-cyan-300 py-1 px-3 rounded-md">
                           Time: {formatTime(timers[exam.id] || 0)}
                        </div>
                    )}
                </div>

                {isExamSubmitted && exam.type === 'mcq' && examState.score !== null && (
                    <div className="my-4 p-4 bg-gray-900/50 rounded-lg border border-cyan-500 text-center">
                        <h3 className="text-xl font-bold text-cyan-300">Your Result</h3>
                        <p className="text-3xl font-semibold mt-1">
                            You scored: <span className="text-cyan-400">{examState.score}%</span>
                        </p>
                    </div>
                )}

                {viewingInstructionsFor === exam.id ? (
                  <div>
                    <h3 className="text-xl font-bold text-cyan-300 mb-4">Exam Instructions</h3>
                    <div className="prose prose-sm prose-invert max-w-none text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: exam.instructions! }}></div>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setViewingInstructionsFor(null)}
                            className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-gray-500 transition-colors duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setViewingInstructionsFor(null);
                                beginTimedExam(exam.id, exam.duration!);
                            }}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        >
                            Confirm & Start Exam
                        </button>
                    </div>
                  </div>
                ) : (
                <>
                  {exam.description && (
                    <p className="text-gray-400 mb-4 ml-8">{exam.description}</p>
                  )}
                  
                  {hasLeaderboard && (
                    <div className="mb-4 ml-8 text-left">
                        <Link
                            to={`/exam/${exam.id}/leaderboard`}
                            className="inline-block bg-gray-700/50 text-cyan-300 font-semibold py-1 px-3 rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm"
                        >
                           🏆 View Leaderboard
                        </Link>
                    </div>
                  )}

                  {exam.type === 'mcq' && (!isTimed || hasStarted) && !isExamSubmitted && (
                    <div className="mb-6 ml-8">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-400">Answer Progress</span>
                        <span className="text-xs font-medium text-gray-400">{Math.round(examProgressPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-900 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${examProgressPercentage}%` }}></div>
                      </div>
                    </div>
                  )}

                  {isTimed && !hasStarted && !isExamSubmitted && (
                    <div className="text-center">
                        <p className="mb-4 text-gray-300">This is a timed exam. You will have {exam.duration} minutes to complete it.</p>
                        {liveWindowMessage && <p className="mb-4 text-yellow-400 text-sm">{liveWindowMessage}</p>}
                        <button 
                          onClick={() => {
                            if (exam.instructions) {
                              setViewingInstructionsFor(exam.id);
                            } else {
                              beginTimedExam(exam.id, exam.duration!);
                            }
                          }}
                          disabled={!isLive}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Start Exam
                        </button>
                    </div>
                  )}
                  
                  {(!isTimed || hasStarted || isExamSubmitted) && (
                      <>
                          {exam.type === 'mcq' && (
                            <form onSubmit={(e) => { e.preventDefault(); handleExamSubmit(exam.id); }}>
                              <div className="space-y-6">
                                {exam.questions.map((q: Question, qIndex: number) => (
                                  <div key={q.id}>
                                    <p className="font-semibold text-white mb-2">{qIndex + 1}. {q.text}</p>
                                    <div className="space-y-2">
                                      {q.options?.map((option, oIndex) => {
                                        const isSelected = examState.answers[q.id] === option;
                                        const isCorrect = q.answer === option;
                                        
                                        let feedbackClasses = 'bg-gray-700 border-transparent';
                                        let textClasses = 'text-gray-200';

                                        if (isExamSubmitted) {
                                          if (isCorrect) {
                                            // Always highlight the correct answer in green.
                                            feedbackClasses = 'bg-green-500/20 border-green-500';
                                            textClasses = 'text-green-300 font-semibold';
                                          } else if (isSelected) { // This option is incorrect because of the 'else'
                                            // Highlight the user's incorrect choice in red.
                                            feedbackClasses = 'bg-red-500/20 border-red-500';
                                            textClasses = 'text-red-300 line-through';
                                          }
                                          // Any other option (incorrect and not selected) will retain the default neutral style.
                                        }

                                        return (
                                          <label key={oIndex} className={`block p-3 rounded-md cursor-pointer transition-all duration-300 border ${feedbackClasses} ${isExamSubmitted ? 'cursor-default' : ''}`}>
                                            <input 
                                              type="radio" 
                                              name={q.id} 
                                              value={option}
                                              checked={isSelected}
                                              onChange={() => !isExamSubmitted && handleAnswerChange(exam.id, q.id, option)}
                                              className="mr-2 accent-cyan-500"
                                              disabled={isExamSubmitted}
                                            />
                                            <span className={textClasses}>{option}</span>
                                          </label>
                                        )
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                               {!isExamSubmitted && <button type="submit" className="mt-6 bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-cyan-500 transition-colors duration-300">Submit Answers</button>}
                            </form>
                          )}
                          {exam.type === 'descriptive' && !isExamSubmitted && (
                             <div className="space-y-4">
                               {exam.questions.map((q: Question, qIndex: number) => (
                                  <div key={q.id}>
                                    <p className="font-semibold text-white mb-2">{qIndex + 1}. {q.text}</p>
                                    <textarea className="w-full bg-gray-700 text-white p-2 rounded-md" rows={4} placeholder="Your answer..."></textarea>
                                  </div>
                               ))}
                               <button className="mt-4 bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg">Submit</button>
                             </div>
                          )}
                     </>
                  )}
                </>
                )}
              </div>
            )})}
          </div>
        );
      default:
        return null;
    }
  };

  const TabButton = ({ tab, label }: { tab: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-300 ${
        activeTab === tab 
        ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400' 
        : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      <div className="p-8 bg-gray-800/50 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">{course.title}</h1>
        <p className="text-lg text-gray-400 mb-4">by {course.instructor}</p>
        <p className="text-gray-300">{course.longDescription}</p>

        <div className="mt-6">
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-cyan-300">Course Progress</span>
            <span className="text-sm font-medium text-cyan-300">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <span className="text-3xl font-bold text-cyan-400">${course.price}</span>
          <button 
            onClick={handleEnroll}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Enroll Now
          </button>
        </div>
      </div>

      <div>
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-4" aria-label="Tabs">
            <TabButton tab="videos" label="Videos" />
            <TabButton tab="materials" label="Materials" />
            <TabButton tab="feed" label="Feed" />
            <TabButton tab="exams" label="Exams" />
          </nav>
        </div>
        <div className="py-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;