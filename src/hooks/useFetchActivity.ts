import { useEffect, useState } from 'react';

const useFetchActivity = (accessToken:any) => {
  const [matches, setMatches] = useState([]);
  const [pokes, setPokes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loadingActivities, setLoadingActivites] = useState(true);

  useEffect(() => {
    const fetchWithToken = async (url:any) => {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
      }

      return response.json();
    };

    const fetchData = async () => {
      try {
        setLoadingActivites(true);

        const [matchesRes, pokesRes, messagesRes] = await Promise.all([
          fetchWithToken('http://localhost:5000/api/home/matches'),
          fetchWithToken('http://localhost:5000/api/home/pokes'),
          fetchWithToken('http://localhost:5000/api/home/messages'),
        ]);

        setMatches(matchesRes.data || []);
        setPokes(pokesRes.data || []);
        setMessages(messagesRes.data || []);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoadingActivites(false);
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  return { matches, pokes, messages, loadingActivities, error };
};

export default useFetchActivity;
