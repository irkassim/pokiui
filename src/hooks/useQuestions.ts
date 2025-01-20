import { useState, useEffect } from 'react';
import axios from 'axios';
import { questionss } from './dummyquestions';


interface Question {
  category: string;
  text: string;
  options: string[];
}

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: number }>({}); // Maps question index to answer
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  // Fetch questions from API
  useEffect(() => {
     const fetchQuestions = async () => {
      const accessToken = localStorage.getItem('accessToken');
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/compatibility/questions',
         { headers: { Authorization: `Bearer ${accessToken}` } }); // Replace with actual endpoint
        setQuestions(response.data.questions);
      } catch (err) {
        setError('Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions(); 
  }, []);

 
  const submitResponses = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/compatibility/questions', 
        { responses,refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }); // Replace with actual endpoint
    } catch (err) {
      setError('Failed to submit responses');
    } finally {
      setLoading(false);
    }
  };

  const saveResponse = (index: number, answer: number) => {
    setResponses((prev) => ({ ...prev, [index]: answer }));
  };

  return {
    questions,
    currentIndex,
    setCurrentIndex,
    responses,
    saveResponse,
    submitResponses,
    loading,
    error,
  };
};
