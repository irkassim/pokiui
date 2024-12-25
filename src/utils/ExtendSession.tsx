import axios from 'axios';

const ExtendSession = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/some-protected-route',
        {
          refreshToken, // Send refresh token in the body
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send access token in the header
          },
        }
      );
  
      console.log('Request successful:', response.data);
    } catch (error: any) {
      console.error('Error extending session:', error.response?.data || error.message);
    }
  };

  export default ExtendSession;
  