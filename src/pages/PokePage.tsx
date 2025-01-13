import React, { useState, useEffect } from 'react';
import { useParams,useLocation } from 'react-router-dom';
import { acceptPoke, rejectPoke } from '../reduxstore/slices/pokeSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../reduxstore/store'; // Import AppDispatch
import { RootState } from '../reduxstore/store'; // Assuming you have a RootState type for your Redux st
import axios from 'axios';

const PokePage: React.FC = () => {
  const { id: userId } = useParams(); // Extract userId from the route
   const location = useLocation();
   const pokeId = new URLSearchParams(location.search).get('use'); // Extract matchId 
   const type = new URLSearchParams(location.search).get('type'); // Extract matchId 
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<any>(null);
  const accessToken = localStorage.getItem('accessToken');
  const dispatch: AppDispatch = useDispatch();
  //console.log("Location:", location);
    //console.log("Params:", useParams());

 // console.log("Hello pokepage")

 // userId && console.log("USERID", userId)
  //pokeId && console.log("PokeId", pokeId)
  useEffect(() => {
    const fetchPokeDetails = async () => {
      const url= `http://localhost:5000/api/profile/user/${userId}?use=${pokeId}&type=${type}`

      console.log("TheURL:", url)
      try {
        const response = await axios.get(
        url,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setUser(response.data.user);
        setAvatar(response.data.user.avatar || '/path/to/placeholder.jpg');
        
      } catch (err) {
        console.error('Error fetching poke details:', err);
      }
    };
    fetchPokeDetails();
  }, [userId,  pokeId]);

 // user && console.log("PokeuSERId", user)
  //avatar && console.log("PokAvatar", avatar)

  
  

  const handleAcceptPoke = () => {
   console.log("Pokepage Accept:", pokeId)
   if (pokeId) {
    dispatch(acceptPoke(pokeId))
      .unwrap()
      .then((res) => {
        console.log("Poke accepted successfully:", res);
      })
      .catch((err) => {
        console.error("Error accepting poke:", err);
      });
  }
  };

 
  
  const handleRejectPoke = (pokeId: any) => {
    console.log("Pokepage Reject:", pokeId)
    const sendRes=  dispatch(rejectPoke(pokeId));
    console.log("Poke Accepted Success:", sendRes)
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">{user.firstName}'s Poke</h1>
      <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center mb-6">
        <img src={avatar} alt={user.firstName} className="w-32 h-32 rounded-full mb-4" />
        <p className="text-lg">{user.bio || 'No bio available'}</p>
        <div className="flex justify-around w-full mt-4">
          <button
            onClick={handleAcceptPoke}
            className="bg-green-500 text-white py-2 px-4 rounded-lg"
          >
            Accept Poke
          </button>
          <button
            onClick={handleRejectPoke}
            className="bg-red-500 text-white py-2 px-4 rounded-lg"
          >
            Reject Poke
          </button>
        </div>
      </div>
      <div>
        <a href={`/profile/user/${userId}`} className="text-blue-500 underline">
          ...More
        </a>
      </div>
    </div>
  );
};

export default PokePage;
