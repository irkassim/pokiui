import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Match {
  id: string;
  name: string;
  avatar: string;
  status: string;
  _id:string;
}

interface MatchesState {
  matches: Match[];
  loading: boolean;
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  loading: false,
  error: null,
};

// Async thunks for accept and reject actions
export const acceptMatch = createAsyncThunk('matches/acceptMatch', async (matchId: string, { rejectWithValue }) => {
  try {

    //Grabbing tokens for request
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    const response = await axios.post(
      `http://localhost:5000/api/match/accept/${matchId}`,
      {refreshToken},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return { matchId, data: response.data };
  } catch (error:any) {
    return rejectWithValue(error.response?.data || 'Error accepting match');
  }
});

export const rejectMatch = createAsyncThunk('matches/rejectMatch', async (matchId: string, { rejectWithValue }) => {
  console.log("MatchID",  matchId)
  try {

    //Grabbing tokens for request
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    console.log("MatchID",  matchId)
    const response = await axios.post(
      `http://localhost:5000/api/match/reject/${matchId}`,
      
      {refreshToken},
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return { matchId, data: response.data };
  } catch (error:any) {
    return rejectWithValue(error.response?.data || 'Error rejecting match');
  }
});

// Match slice
const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setMatches(state, action: PayloadAction<Match[]>) {
      state.matches = action.payload;
      state.loading = false;
    },
    clearMatches(state) {
      state.matches = [];
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle accept match
      .addCase(acceptMatch.pending, (state) => {
      
        state.loading = true;
      })
      .addCase(acceptMatch.fulfilled, (state, action) => {
       
        state.loading = false;
        const match = state.matches.find((m) => m.id === action.payload.matchId);
        if (match) match.status = 'accepted';
      })
      .addCase(acceptMatch.rejected, (state, action) => {
        
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle reject match
      .addCase(rejectMatch.pending, (state) => {
        console.log("Reject match pending...");
        state.loading = true;
      })
      .addCase(rejectMatch.fulfilled, (state, action) => {
        console.log("Reject match fulfilled:", action.payload);
        state.loading = false;
        state.matches = state.matches.filter((m) => m.id !== action.payload.matchId);
      })
      .addCase(rejectMatch.rejected, (state, action) => {
        console.error("Reject match rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setMatches, clearMatches, setLoading } = matchSlice.actions;
export default matchSlice.reducer;
