import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../reduxstore/store'; // Adjust the path to your store file
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reduxstore/store'; // Redux store type
import { fetchMessages, sendMessage, setRecipientId } from '../reduxstore/slices/messageSlice'; // Thunks for messages
import EmojiPicker from 'emoji-picker-react'; // Emoji picker library

const MessagesPage: React.FC = () => {
 // const { id: userId } = useParams(); // Extract userId from route
  //const { id: recipientId } = useParams(); // Extract userId from route
  const { userId, conversationId } = useParams<{ userId: string; conversationId: string }>();
  const location = useLocation();
 // const conversationId = new URLSearchParams(location.search).get('use'); // Extract matchId 
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const messagesState = useSelector((state: RootState) => state.messages);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  
  const { messages, lastMessage, recipientName, loading, error } = useSelector(
    (state: RootState) => state.messages
  );

  /* useEffect(() => {
    if (userId && conversationId) {
      dispatch(setRecipientId(userId));
      dispatch(fetchMessages({ userId, conversationId }));
    }
  }, [dispatch, userId, conversationId]);
 */

  if (!userId) {
    console.error('No userId found in the URL.');
  }
 
  useEffect(() => {
    if (userId && conversationId) {
      const fetchMessagesData = async () => {
        try {
          const res = await dispatch(fetchMessages({ userId, conversationId }));
         
           // dispatch(setRecipientId(userId))    
          console.log('Fetch Messages Response:', res);
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
  
      fetchMessagesData();
    }
  }, [dispatch, userId, conversationId]);
  
// Scroll to the end of the chat on new messages
useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesState.messages]);

   message && console.log("MessPage", message)
   messagesState && console.log("TheState", messagesState)
  userId && console.log("MessUser", userId)

  

  // Handle message input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    console.log("sendMessage:", message)
    if (message.trim()  && userId) {
      dispatch(sendMessage({ userId, content: message.trim() }));
      setMessage('');
    }
  };

  if (loading) return <div>Loading messages...</div>;
  if (error) return <div>Error loading messages: {error}</div>;
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
        <button className="text-blue-500 font-bold" onClick={() => navigate(-1)}>
          Back
        </button>
        <h2 className="text-xl font-bold">{messagesState.recipientName || 'Chat'}</h2>
      </div>
      {messagesState.loading && <p>Loading messages...</p>}
      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
            {messagesState.messages.map((msg:any, index) => {
                const senderName = msg.sender?.firstName || "Unknown Sender";
                const recipientName = msg.recipient?.firstName || "Unknown Recipient";

                // Check if the current user is the recipient
                const isCurrentUser = msg.recipient?._id === userId;

         return (
                <div key={index} className={`flex mb-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-lg ${ isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-300"
                    }`}
                    >
                    <p className="font-semibold text-sm">
                        {isCurrentUser ? recipientName : senderName}
                    </p>
                    <p>{msg.content}</p>
                    <span className="text-xs text-gray-600">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                    </div>
                </div>
                );
            })}
            <div ref={chatEndRef} />
            </div>


      {/* Input Bar */}
      <div className="flex items-center px-4 py-2 bg-white border-t">
        <button className="text-2xl mr-2" onClick={() => setShowEmojiPicker((prev) => !prev)}>
          😊
        </button>
        {showEmojiPicker && (
          <div  className="absolute bottom-16 left-4" onClick={()=>setShowEmojiPicker(false)}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;
