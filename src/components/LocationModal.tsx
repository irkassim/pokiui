import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';


const LocationModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
 
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
    
        const formattedLocation = {
          type: "Point",
          coordinates: [longitude, latitude], // Longitude first, then latitude
        };
    
        console.log("Formatted Location:", formattedLocation);
    
        const refreshToken = localStorage.getItem('refreshToken');
        const accessToken = localStorage.getItem('accessToken');
    
        console.log('Headers:', {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        });
    
        // Send location to backend
        fetch('http://localhost:5000/api/location/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            refreshToken,
            location: formattedLocation,
          }),
        })
          .then((response) => {
            if (!response.ok) throw new Error('Failed to send location');
            return response.json(); // Ensure this is returned
          })
          .then((data) => {
            console.log('Location saved successfully:', data);
            onClose(); // Close the modal
          })
          .catch((err) => {
            console.error('Error saving location:', err);
            setError('Failed to send location to server.');
          });
      },
      (err) => {
        setError('Failed to fetch your location. Please try again.');
      }
    );
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm">
        <h2 className="text-lg font-bold mb-4">This is where you are?</h2>
        <div className="flex justify-center mb-4">
          <i className="text-blue-500 text-4xl">📍</i>
        </div>
        <p className="text-gray-700 text-sm mb-4">
          Allow us to access your location to prepare your potential people around you.
        </p>
        <button
          onClick={requestLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Allow Location
        </button>
        {location && (
          <p className="text-green-500 mt-4">
            Location: {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
          </p>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default LocationModal;
