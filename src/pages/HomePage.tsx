import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useFetchUser, useFetchPhotos } from '../hooks/useFetch';
import useFetchActivity from '../hooks/useFetchActivity';

interface User {
  id: number;
  name: string;
  avatar: string;
  lastMessage?: string;
}

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matches' | 'pokes' | 'messages'>('matches');
  const [leftPaneWidth, setLeftPaneWidth] = useState(25); // Left pane width in percentage
  const refreshToken = localStorage.getItem('refreshToken');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
 /*  const [matches, setMatches] = useState<any[]>([]);
  const [pokes, setPokes] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]); */
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');
  const { user, setUser, loading } = useFetchUser(accessToken, refreshToken);
  const { photos, setPhotos } = useFetchPhotos(accessToken, refreshToken);
  const { matches, pokes, messages, loadingActivities, error } = useFetchActivity(accessToken);

  user && console.log("homeboy:", user)
  photos && console.log("homephotos:", photos)

  // Fetch matches, pokes, and messages

  pokes && console.log("Pokes:", pokes)
  matches && console.log("matches:", matches )
  // Set avatar URL based on user's avatar
  useEffect(() => {
    if (user && photos.length > 0) {
      const avatarPhoto = photos.find((photo) => photo._id === user.avatar);
      if (avatarPhoto) {
        setAvatarUrl(avatarPhoto.src);
      } else {
        setAvatarUrl(undefined);
      }
    }
  }, [user, photos]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  if (loadingActivities) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const renderContent = () => {
    const renderGrid = (data: any[], emptyMessage: string, isMatch = false, user?: any) => (
      <div className="grid grid-cols-3 gap-4">
        {data.length > 0 ? (
          data.map((item) => {
            const userItem = isMatch ? item.users.find((u:any) => u._id !== user?.id) : item.poker;
            const avatar = Array.isArray(userItem.avatar) ? userItem.avatar[0] : userItem.avatar;
    
            return (
              <div  onClick={() => navigate(`/profile/user/${userItem?._id}`)}
              key={item._id} className="flex flex-col items-center p-2 border rounded">
                <img
                  src={avatar || '/path/to/placeholder.jpg'}
                  alt={userItem.firstName || 'Unknown'}
                  className="w-20 h-20 rounded-full mb-2"
                />
                <span className="font-medium">{userItem.firstName}</span>
                {item.status === 'pending' && (
                  <span className="text-yellow-500 text-sm">Pending</span>
                )}
                {item.status === 'accepted' && (
                  <span className="text-green-500 text-sm">Accepted</span>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-3 text-gray-500">{emptyMessage}</p>
        )}
      </div>
    );
    
    

    if (activeTab === 'matches') {
      return renderGrid(matches, 'No matches right now', true,user);
    }

    if (activeTab === 'pokes') {
      return renderGrid(pokes, 'No pokes right now', false, user);
    }

    if (activeTab === 'messages') {
      return renderGrid(messages, 'No messages right now',false, user);
    }

    return null;
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
            {avatarUrl && user && (
              <img
                src={avatarUrl}
                alt={user?.firstName || 'User'}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-medium">{user?.firstName}</span>
          </div>
          <button onClick={handleLogout} className="text-red-500 font-bold ml-4">
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
      </div>

      {/* Right Pane (Outlet for Other Pages) */}
      <div className="flex-1 bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
