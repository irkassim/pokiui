import React, { useState, useEffect, useRef,useMemo, } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../reduxstore/store'; 
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reduxstore/store'; // Redux store type
//import { fetchMessages, sendMessage, setRecipientId } from '../reduxstore/slices/messageSlice'; // Thunks for messages
import EmojiPicker from 'emoji-picker-react'; // Emoji picker library
import useMessages from '../hooks/useMessages';
import { debounce } from '../utils/debounce'; 



const MessagesPage: React.FC = () => {
  const { id: userId } = useParams(); // Extract userId from route
  //const { id: recipientId } = useParams(); // Extract userId from route
  //const { userId, conversationId } = useParams<{ userId: string; conversationId: string }>();
  const location = useLocation();
  const conversationId = new URLSearchParams(location.search).get('use'); // Extract matchId 
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const messagesState = useSelector((state: RootState) => state.messages);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loadingNew, setLoadingNew] = useState<boolean>(false);
  const socket = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { messages, fetchMessages, sendMessage } = useMessages("ws://localhost:5000");
  const currentUser = useSelector((state: RootState) => state.user.user);
/* 
  useEffect(() => {
    if (!conversationId || !userId) return;
  
    const intervalId = setInterval(() => {
      fetchMessages(conversationId, userId);
    }, 5000); // Poll every 5 seconds
  
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [conversationId, userId, fetchMessages]);
   */
 
  useEffect(() => {
    const fetchMessagesData = async () => {
      try {
        if (conversationId && userId) {
          const res = await fetchMessages(conversationId, userId);
          //console.log("NewMessages:",res, )
         }    
      } catch (error) {
        console.error('Error fetching messages:', error)  
      }
    }; fetchMessagesData()
  }, [conversationId, userId,fetchMessages, ]);


  // Scroll to the end of the chat on new messages
useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messagesState.messages, messages]);

/* //SendMessages
const handleSendMessage = () => {
  if (userId && message) {
    console.log("Incoming Message:", message); // Log the incoming message
    try {
      sendMessage(userId, message.trim()); // Trigger sendMessage
      setMessage(''); // Clear input
      console.log("Message sent via sendMessage function.");
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
    }
  } else {
    console.error("Missing userId or message content.");
  }
}; */


  messages && console.log("TheNewMessages:", messages)
  if (!userId) {
    console.error('No userId found in the URL.');
  }
  
   message && console.log("MessPage", message)
  //messagesState && console.log("TheState", messagesState)
  //userId && console.log("MessUser", userId)

// Debounced typing status sender
const sendTypingStatus = useMemo(
  () =>
    debounce((isTyping: boolean) => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify({ type: 'typing', isTyping }));
      }
    }, 5000),
  [] // Dependencies for useMemo
);

 // Handle message input
 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value;
  setMessage(inputValue);
   // Send debounced typing status
   sendTypingStatus(inputValue.trim().length > 0);
 }

 //Sending MESSAGE
 const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  console.log("Message sending.....");
  e.preventDefault();
  if (userId && message) {
    console.log("Message sending USEID.....", userId, message.trim());
    sendMessage(userId, message.trim()); // Trigger sendMessage
    setMessage(''); // Clear input
    console.log("Message sent via sendMessage function.");
    console.log('Message sent:', message); // Replace with your send logic
  } 
  setMessage(''); // Clear input after sending
};


  // Handle emoji selection
  const handleEmojiClick = (emojiObject: any) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

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
      {messages && messages?.map((msg: any, index: number) => {
      const senderName = msg.sender?.firstName || "Unknown Sender";
      const recipientName = msg.recipient?.firstName || "Unknown Recipient";

        // Determine if the current user is the sender of the message
        const isCurrentUser = msg.recipient?._id === currentUser?.user?._id 
        const avatarUrl = isCurrentUser ? msg.sender?.avatarSignedUrl : msg.recipient?.avatarSignedUrl;
        const name = isCurrentUser ? msg.sender?.firstName : msg.recipient?.firstName;
        //||msg.recipient?._id===currentUser?.user?._id;
  
        //console.log("isCurrentUser:", isCurrentUser, "Message:", msg);
        //console.log("NAMES:", senderName, recipientName);

  return (
    <div
      key={index}
      className={`flex mb-2 ${isCurrentUser ? "justify-start" : "justify-end"}`}
    >
       {/* Display avatar */}
        <img src={avatarUrl} alt={`${ name}'s Avatar`}
          className={`w-10 h-10 rounded-full ${isCurrentUser ? "mr-2" : "ml-2"}`}/>

                {/* Message content */}
                <div className={`max-w-xs px-4 py-2 rounded-lg ${ isCurrentUser ?
                 "bg-blue-500 text-white" : "bg-gray-300" }`} >
                    <p className="font-semibold text-sm">
                      { name}
                    </p>

                    <p className="text-container">{msg.content}</p>

                    <span className="text-xs text-gray-600">

                    {new Date(msg.createdAt).toLocaleTimeString()}
                   </span>
                </div>

              </div> );
            })}

            <div ref={chatEndRef} /> </div>


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

      
            <form onSubmit={handleFormSubmit}>
             <input
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg  "
            />
            <button type='submit' className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2">
              Send
            </button>
            </form>
      
       
          </div>
    </div>
  );
};

export default MessagesPage;
