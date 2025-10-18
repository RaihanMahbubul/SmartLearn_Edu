import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExamLeaderboard } from '../services/examService.ts';
import { LeaderboardEntry } from '../types.ts';
import { MOCK_COURSES } from '../constants.ts';
import Spinner from '../components/Spinner.tsx';

const LeaderboardPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Find the exam and course for context
    const examInfo = MOCK_COURSES
        .flatMap(course => course.exams.map(exam => ({ ...exam, courseId: course.id, courseTitle: course.title })))
        .find(exam => exam.id === examId);

    useEffect(() => {
        if (examId) {
            getExamLeaderboard(examId)
                .then(data => {
                    setLeaderboard(data);
                })
                .catch(err => {
                    setError('Failed to load leaderboard.');
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [examId]);

    const renderTrophy = (rank: number) => {
        const classes = "w-6 h-6";
        if (rank === 1) return <span className={classes} role="img" aria-label="gold medal">🥇</span>;
        if (rank === 2) return <span className={classes} role="img" aria-label="silver medal">🥈</span>;
        if (rank === 3) return <span className={classes} role="img" aria-label="bronze medal">🥉</span>;
        return <span className={`${classes} text-gray-500`}>{rank}</span>;
    }

    if (loading) return <div className="flex justify-center mt-20"><Spinner /></div>;
    if (error) return <div className="text-center text-red-400 mt-10 p-8 bg-gray-800/50 rounded-lg">{error}</div>;
    
    return (
        <div className="bg-gray-800/50 p-8 rounded-xl shadow-lg border border-gray-700">
            <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                Leaderboard
            </h1>
            <p className="text-center text-gray-400 mb-8 text-lg">{examInfo?.title}</p>

            {leaderboard.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Score</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time Taken</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900/50 divide-y divide-gray-700">
                            {leaderboard.map((entry) => (
                                <tr key={entry.rank} className="hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-white">{renderTrophy(entry.rank)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{entry.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-300">{entry.score}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{entry.timeTaken}s</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-10">
                    <h2 className="text-xl font-semibold text-white">No submissions yet!</h2>
                    <p className="text-gray-400 mt-2">Be the first to take the exam and claim the top spot.</p>
                </div>
            )}
             {examInfo && (
                <div className="mt-8 text-center">
                    <Link
                        to={`/course/${examInfo.courseId}`}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                        &larr; Back to {examInfo.courseTitle}
                    </Link>
                </div>
             )}
        </div>
    );
};

export default LeaderboardPage;