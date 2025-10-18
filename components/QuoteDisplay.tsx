
import React, { useState, useEffect } from 'react';
import { fetchMotivationalQuote } from '../services/geminiService';
import Spinner from './Spinner';

const QuoteDisplay: React.FC = () => {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getQuote = async () => {
      try {
        setLoading(true);
        const fetchedQuote = await fetchMotivationalQuote();
        setQuote(fetchedQuote);
      } catch (err) {
        setError('Failed to fetch quote. Please try again later.');
        setQuote("The beautiful thing about learning is that no one can take it away from you."); // Fallback quote
      } finally {
        setLoading(false);
      }
    };

    getQuote();
  }, []);

  return (
    <div className="text-center p-4 min-h-[60px]">
      {loading ? (
        <Spinner />
      ) : (
        <blockquote className="text-xl italic text-cyan-300">
          "{quote}"
        </blockquote>
      )}
      {error && <p className="text-red-400 mt-2">{error}</p>}
    </div>
  );
};

export default QuoteDisplay;
