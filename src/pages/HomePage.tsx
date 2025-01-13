import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useFetchUser, useFetchPhotos } from '../hooks/useFetch';
import useFetchActivity from '../hooks/useFetchActivity';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reduxstore/store';
import { setMatches,   } from '../reduxstore/slices/matchSlice';
import {  setPokes, } from '../reduxstore/slices/pokeSlice';
import {  setMessages } from '../reduxstore/slices/messageSlice';
import { selectMatches } from '../reduxstore/selectors';
import { selectPokes } from '../reduxstore/selectors';
import { selectMessages } from '../reduxstore/selectors';
import axios from 'axios';
import { match } from 'assert';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  /* const { matches, pokes, messages } = useSelector((state: RootState) => ({
    matches: state.matches.matches,
    pokes: state.pokes.pokes,
    messages: state.messages.messages,
  })); */

  const matches = useSelector(selectMatches); // Use memoized selector
  const pokes = useSelector(selectPokes); // Use memoized selector
  const messages = useSelector(selectMessages); // Use memoized selector


  const accessToken = localStorage.getItem('accessToken');
  const { user, setUser, loading } = useFetchUser(accessToken, refreshToken);
  const { photos, setPhotos } = useFetchPhotos(accessToken, refreshToken);
  //const { matches, pokes, messages, loadingActivities, error } = useFetchActivity(accessToken);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');

      try {
        const [matchesRes, pokesRes, messagesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/home/matches', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get('http://localhost:5000/api/home/pokes', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          axios.get('http://localhost:5000/api/home/messages', {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ]);

        dispatch(setMatches(matchesRes.data.data));
        dispatch(setPokes(pokesRes.data.data));
        dispatch(setMessages(messagesRes.data.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  messages && console.log("HomeMessages:", messages)
 /*  user && console.log("homeboy:", user)
  photos && console.log("homephotos:", photos)
 */
  // Fetch matches, pokes, and messages

   /* pokes && console.log("Pokes:", pokes)
  matches && console.log("matches:", matches )  */
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

  /* if (loadingActivities) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>; */
  const renderContent = () => {
    const renderGrid = (data: any[], emptyMessage: string, isMatch: boolean = false, type: string, loggedInUser?: any,) => (
      <div className="grid grid-cols-3 gap-4">
        {data.length > 0 ? (
          data.map((item, index) => {
            //const userItem = isMatch ? item.users.find((u:any) => u._id !== loggedInUser?._id) : item.poker;

            let userItem: any = null;
            let avatar: string | undefined = undefined;

            if (type === "message") {
              const senderId = item.lastMessage?.sender;
              const receiver = item.participants?.find((participant: any) => participant._id !== loggedInUser?._id);
              userItem = senderId === loggedInUser?._id ? receiver : item?.participants?.find((p: any) => p._id === senderId);
             // userItem = senderId === user?._id ? receiver: item?.participants?.find((p: any) => p._id === senderId);
              avatar = Array.isArray(userItem?.avatar) ? userItem.avatar[0] : userItem?.avatar;
              userItem&& console.log("MessageUserITEM:", item, senderId, receiver, userItem);
              userItem&& console.log("ITEM TYPE:", type, "USERITEMID:",userItem._id);
            } else if (isMatch) {
              // Extract data for matches
              //console.log("ITEM:", userItem, "ITEM TYPE:", type,"ISMATCH", isMatch);
              userItem = item.users.find((u: any) => u._id !== loggedInUser?._id);
              avatar = Array.isArray(userItem?.avatar) ? userItem.avatar[0] : userItem?.avatar;
            } else {
              // Extract data for pokes
              //console.log("ITEM:", userItem, "ITEM TYPE:", type,"ISMATCH", isMatch);
              userItem = item.poker;
              avatar = Array.isArray(userItem?.avatar) ? userItem.avatar[0] : userItem?.avatar;
            }
    
            if (!userItem) {
              console.warn("No valid userItem found for item:", item, "Type:", type);
              return null; // Avoid rendering if userItem is not defined
            }
            
            //const type= activeTab;
           // console.log("ITEM:", userItem, "ITEM TYPE:", type,"ISMATCH", isMatch);
           // const avatar = Array.isArray(userItem.avatar) ? userItem.avatar[0] : userItem.avatar;
    
            return (
              <div 
                  onClick={() => navigate(`/profile/${type}/${userItem._id}?use=${item._id}&type=${type}`)}
                  //onClick={() => navigate(`/profile/${type}/${item._id}?userId=${userItem._id}&type=${type}`)}
                  key={item._id} className="flex flex-col items-center p-2 border rounded">
                    <img
                      src={avatar || '/path/to/placeholder.jpg'}
                      alt={userItem.firstName || 'Unknown'}
                      className="w-20 h-20 rounded-full mb-2"
                    />
                    <span className="font-medium">{userItem.firstName}</span>
                    {type === "messages" && (
                  <span className="text-sm text-gray-500"> {item.lastMessage?.content || "No messages yet"}
                  </span> )}

                    {item.status === 'pending' && ( <span className="text-yellow-500 text-sm">Pending</span> )}
                    {item.status === 'accepted' && (<span className="text-green-500 text-sm">Accepted</span>)}
                  </div> );}) ) :
                   ( <p className="text-center col-span-3 text-gray-500">{emptyMessage}</p> )}
      </div>   );

              
    
   /*  {activeTab === 'matches' && renderGrid(matches, "No matches right now", "match", true)}
    {activeTab === 'pokes' && renderGrid(pokes, "No pokes right now", "poke", false)}
    {activeTab === 'messages' && renderGrid(messages, "No messages right now", "message", false)}
 */

    if (activeTab === 'matches') {
      const type = 'match';
      return renderGrid(matches, 'No matches right now', true, type, user);
    }

    if (activeTab === 'pokes') {
      const type = 'poke';
      return renderGrid(pokes, 'No pokes right now', false, type, user);
    }

    if (activeTab === 'messages') {
      const type = 'message';
      return renderGrid(messages, 'No messages right now',false, type, user);
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
