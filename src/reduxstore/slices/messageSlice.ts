import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  content: string;
  createdAt: string;
}

interface MessagesState {
  messages: Message[];
  newMessages:Message[];
  recipientName: string;
  recipientId: string;
  lastMessage:Message[];
  fetchNew:boolean;
  loading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  messages: [],
  newMessages: [],
  lastMessage:[],
  recipientName: '',
  recipientId:"",
  fetchNew:false,
  loading: false,
  error: null,
};

interface FetchMessagesPayload {
  userId: string;
  conversationId: string;
}

// Async thunk for fetching messages
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (payload: FetchMessagesPayload, { rejectWithValue }) => {
    const { userId, conversationId } = payload;
    try {
      console.log("get Messages:", userId)
      let type="message"
      const accessToken = localStorage.getItem('accessToken');
      //const refreshToken = localStorage.getItem('refreshToken');
      const response = await axios.get(
        `http://localhost:5000/api/message/conversation/${userId}?use=${conversationId}&type=${type}`,
       
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error fetching messages');
    }
  }
);

// Async thunk for sending a message
export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (
    
    { userId, content }: { userId: string; content: string },
    { rejectWithValue }
  ) => {
    console.log("Sending Message:", userId, content)
    //let recipient=""
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      const response = await axios.post(
        `http://localhost:5000/api/message/send`,
        { content, refreshToken, recipient:userId},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error sending message');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
      state.loading = false;
    },
    setNewMessages(state, action: PayloadAction<Message[]>) {
      state.newMessages = action.payload;
      state.loading = false;
    },
    clearMessages(state) {
      state.messages = [];
      state.recipientName = '';
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setFetchNew(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setRecipientId(state, action: PayloadAction<string>) {
      state.recipientId = action.payload;
    },
    setRecipientName(state, action) {
      state.recipientName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;

        if(state.fetchNew){
          console.log("Fetching new")
          state.newMessages = action.payload.messages || [];
          state.fetchNew=false;
        }else{
          state.messages = action.payload.messages || [];
        }
       
        state.recipientId = action.payload.userId;
        // Automatically set the last message
        if (action.payload.messages.length > 0) {
          state.lastMessage = action.payload.messages[action.payload.messages.length - 1];
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload.message);
        state.recipientId = action.payload.userId;

        // Automatically set the last message
        if (action.payload.messages.length > 0) {
          state.lastMessage = action.payload.messages[action.payload.messages.length - 1];
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMessages, clearMessages,setRecipientName, setLoading,
  setFetchNew, setNewMessages, setRecipientId } = messagesSlice.actions;
export default messagesSlice.reducer;
