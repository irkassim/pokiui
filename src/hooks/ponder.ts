import { useEffect, useState } from 'react';

const useFetchActivity = (accessToken:any, refreshToken: any) => {
  const [matches, setMatches] = useState([]);
  const [pokes, setPokes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
const [userId, setUserId] = useState('67701844641eec415b9d7142'); 
const [latitude, setLatitude] = useState(5.7297233);
const [longitude, setLongitude] = useState(-0.1847117);

// Example: dynamically updating state
useEffect(() => {
  // Example of dynamically updating user location
  navigator.geolocation.getCurrentPosition((position) => {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
  });
}, []);


  useEffect(() => {
    const fetchWithToken = async (url:any) => {
      let response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 401) {
        // Refresh the token if expired
        const refreshResponse = await fetch('http://localhost:5000/api/auth/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh token');
        }

        const refreshData = await refreshResponse.json();
        localStorage.setItem('accessToken', refreshData.accessToken);

        // Retry the original request with the new token
        response = await fetch(url, {
          headers: { Authorization: `Bearer ${refreshData.accessToken}` },
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
      }

      return response.json();
    };

    const fetchData = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    if (accessToken && refreshToken) {
      fetchData();
    }
  }, [accessToken, refreshToken]);

  return { matches, pokes, messages, loading, error };
};

export default useFetchActivity;
