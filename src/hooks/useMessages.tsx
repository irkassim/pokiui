import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Install UUID library if not already added
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../reduxstore/store'; // Assuming you have a RootState type for your Redux st
import { fetchUserProfile } from '../reduxstore/slices/userSlice';



interface Message {
  _id: string;
  recipientId: string;
  conversationId:string
  sender: {
    _id: string;
    firstName: string;
    avatarSignedUrl: string;
  };
  content: string;
  createdAt: string;
  recipient: {
    _id: string;
    firstName: string;
    avatarSignedUrl: string;
  };
}

interface Message {
  recipientId: string;
  content: string;
}

interface UseMessagesReturn {
  //newMessages: Message[];
  messages: Message[];
  loading: boolean;
  error: string | null;
  fetchMessages: (recipientId: string,  userId: string) => Promise<void>;
  sendMessage: (userId: string, content: string) => Promise<void>;
}

const useMessages = (serverUrl: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId]=useState<string | null>(null)
 // Fetch the current user from Redux
 const dispatch = useDispatch();
 const currentUser = useSelector((state: RootState) => state.user.user);


  useEffect(() => {
  // Dispatch fetchUserProfile on app load
  dispatch(fetchUserProfile()as any);
}, [dispatch]);
 
//currentUser && console.log("cuRRENTUS:", currentUser)


  // Connect to WebSocket server
  useEffect(() => {
    const ws = new WebSocket(serverUrl);
    console.log("ServerURL:", serverUrl)
    ws.onopen = () => {
      console.log('Connected to WebSocket server');
    };

   if(socket){
    socket.onopen = () => {
      console.log('Connected to WebSocket server22');
      socket.send(JSON.stringify({ type: 'ping' })); // Test message
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
   }
     //Client-side handling of messages
    ws.onmessage = (event) => {
      try {
        const receivedMessage = JSON.parse(event.data);
    
        if (receivedMessage.type === 'chat') {
          setMessages((prev) => [...prev, receivedMessage]);
        } else {
          console.log('Non-chat message received:', receivedMessage);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', event.data);
      }
    };
    
    //closing sockets
    ws.onclose = () => {
      console.log("ServerURL:", serverUrl)
      console.log('Disconnected from WebSocket server');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [serverUrl]);

  

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string, userId:string) => {
    setLoading(true);
    setError(null);

    try {
      /* const response = await axios.get<Message[]>(); */
      const accessToken = localStorage.getItem('accessToken');
      const type="message"
      const url = `http://localhost:5000/api/message/conversation/${userId}?use=${conversationId}&type=${type}`

      //console.log("conversationId:", conversationId)
      const response = await axios.get( url,  { headers: { Authorization: `Bearer ${accessToken}` } });
      console.log("USERRES",response.data.messages)
      setMessages(response.data.messages);
    } catch (err) {
      setError('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a message to a specific conversation
    const sendMessage = useCallback(
    async (userId: string, content: string, ) => {

      console.log("UseMessages:", userId, content)
          //check if there is a logged in user
           if (!currentUser) {
            console.error('User not logged in');
            return;
         }

         try {

          const message = { recipient: userId, content };
          const accessToken = localStorage.getItem('accessToken');
          const refreshToken = localStorage.getItem('refreshToken');
  
          currentUser && console.log("UseMessages:", message, currentUser?.user?._id)
          const theUrl= "https://pokistorage.picture.com"
  
          const optimisticMessage = {
            _id: `temp-${uuidv4()}`, // Temporary unique ID
            conversationId: currentConversationId || null, 
            content,
            sender: { _id: currentUser?.user?._id, avatar: currentUser?.user?.avatar, avatarSignedUrl: theUrl,
            firstName: currentUser?.user?.firstName }, // Populate as per your app
            recipient: { _id: userId, avatar: "457548686835468",avatarSignedUrl: theUrl, firstName: 'Recipient' }, // Populate as per your app
            createdAt: new Date().toISOString(),
            type: 'chat',
          };
  
          console.log("Optimistic message:", optimisticMessage )
  
          // Add the optimistic message to the state
              setMessages((prev:any) => [...prev, optimisticMessage]);
    
          const response = await axios.post( `http://localhost:5000/api/message/send`,
            { content, refreshToken, recipient:userId},
            { headers: { Authorization: `Bearer ${accessToken}` } } );
  
          const { conversationId, ...newMessage } = response.data;
          
  
          // Replace the optimistic message with the actual backend response
          setMessages((prev) =>
            prev.map((msg) =>
              msg._id.startsWith('temp-') && msg.content === newMessage.content
                ? { ...msg, ...newMessage }
                : msg
            )
          );

          //console.log("WebSocket:", message,) // WebSocket broadcast
          console.log("WebSocketMessages:", messages,)
  
          // Update the conversation ID (if newly created)
              setCurrentConversationId(conversationId);
  
          if (socket && socket.readyState === WebSocket.OPEN) {
            console.log("NEWMSESSAG:", newMessage)
          // Send WebSocket event for other clients
          socket.send(JSON.stringify(newMessage));
          //console.log("response.data:", response.data)

         /*  if (optimisticMessage.type === 'chat') {
            setMessages((prev:any) => [...prev, optimisticMessage]);
          } else {
            console.log("Non-chat message received:", response.data);
          } */

          } else {
          console.error('WebSocket is not connected');
          // Remove optimistic message if sending fails
          //setMessages((prev) => prev.filter((msg) => msg._id !== optimisticMessage._id));    
        }
          
         } catch (error) {
          console.error("Failed to send message:", error);
          
         }
    },
       [socket, currentUser, currentConversationId]
  );

  return { messages, loading, error, fetchMessages, sendMessage };
};

export default useMessages;
