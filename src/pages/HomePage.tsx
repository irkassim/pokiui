import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import LocationModal from '../components/LocationModal';
import { Navigate } from 'react-router-dom';
//import { useAuth } from '../context/AuthContext';

interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage?: string;
}

const HomePage: React.FC = () => {
  const [isLocationModalOpen, setLocationModalOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'matches' | 'pokes' | 'messages'>('matches');
  const [leftPaneWidth, setLeftPaneWidth] = useState(25); // Left pane width in percentage
  const navigate = useNavigate()
  // Mock user data
  const currentUser = { id: 1, firstName: 'John', avatar: '/path/to/avatar.jpg' };
  const matches: User[] = [
    { id: 1, name: 'Alice', avatar: '/path/to/avatar1.jpg' },
    { id: 2, name: 'Bob', avatar: '/path/to/avatar2.jpg' },
  ];

  const pokes: User[] = [
    { id: 3, name: 'Charlie', avatar: '/path/to/avatar3.jpg' },
    { id: 4, name: 'Diana', avatar: '/path/to/avatar4.jpg' },
  ];

  const messages: User[] = [
    { id: 5, name: 'Eve', avatar: '/path/to/avatar5.jpg', lastMessage: 'Hello there!' },
    { id: 6, name: 'Frank', avatar: '/path/to/avatar6.jpg', lastMessage: 'Are we meeting?' },
  ];
  const closeModal = () => setLocationModalOpen(false);
 /*  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect logged-in users to the homepage
  } */
  const renderContent = () => {
    if (activeTab === 'matches') {
      return matches.map((user) => (
        <div key={user.id} className="flex items-center p-2">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-2" />
          <span>{user.name}</span>
        </div>
      ));
    }

    if (activeTab === 'pokes') {
      return pokes.map((user) => (
        <div key={user.id} className="flex items-center p-2">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-2" />
          <span>{user.name}</span>
        </div>
      ));
    }

    if (activeTab === 'messages') {
      return messages.map((user) => (
        <div key={user.id} className="flex items-center p-2">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-2" />
          <div>
            <p>{user.name}</p>
            <p className="text-gray-500 text-sm">{user.lastMessage}</p>
          </div>
        </div>
      ));
    }

    return null;
  };

  const handleDragStart = (e: MouseEvent) => {
    // Prevent text selection during drag
    e.preventDefault();
  
    // Add mousemove and mouseup listeners to the document
    const onMouseMove = (event: MouseEvent) => {
      const newWidth = ((event.clientX / window.innerWidth) * 100).toFixed(2);
      setLeftPaneWidth(Math.min(Math.max(Number(newWidth), 20), 40)); // Clamp width between 20% and 40%
    };
  
    const onMouseUp = () => {
      // Remove event listeners when dragging stops
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  
    // Add event listeners to track mouse movement
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  // Attach to the onMouseDown handler
  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent browser default behaviors
    document.addEventListener('mousemove', handleDragStart); // Use native MouseEvent
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', handleDragStart);
    });
  };
  
  //Signout
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };
  

  return (
    <div className="flex h-screen">
      {/* Left Pane */}
      <div
        className="bg-gray-100 border-r overflow-y-auto relative"
        style={{ width: `${leftPaneWidth}%` }}
      >
        {/* Top Bar */}
        <div className="p-4 bg-white shadow flex items-center justify-between">
         <div className="flex items-center space-x-2">
            <img
              src={currentUser.avatar}
              alt={currentUser.firstName}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{currentUser.firstName}</span>
          </div>
          <button onClick={handleLogout} className="text-red-500 font-bold ml-4" >
                Sign Out
         </button>

          <button className="text-blue-500 font-bold">Settings</button>
         
        </div>

        {/* Tabs */}
        <div className="flex justify-around p-4 bg-gray-200">
          <button
            className={`font-bold ${activeTab === 'matches' ? 'text-blue-500' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </button>
          <button
            className={`font-bold ${activeTab === 'pokes' ? 'text-blue-500' : ''}`}
            onClick={() => setActiveTab('pokes')}
          >
            Pokes
          </button>
          <button
            className={`font-bold ${activeTab === 'messages' ? 'text-blue-500' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
        </div>

        {/* Content */}
        <div className="p-4">{renderContent()}</div>

        {/* Draggable Handle */}
        <div
          className="absolute top-0 right-0 h-full w-1 bg-gray-400 cursor-col-resize"
          onMouseDown={(e) => {
            document.addEventListener('mousemove', handleDragStart);
            document.addEventListener('mouseup', () => {
              document.removeEventListener('mousemove', handleDragStart);
            });
          }}
        ></div>
      </div>
      {isLocationModalOpen && <LocationModal onClose={closeModal} />}

      {/* Right Pane (Outlet for Other Pages) */}
      <div className="flex-1 bg-white">
      {!isLocationModalOpen &&  <Outlet />}
       
      </div>
    </div>
  );
};

export default HomePage;
