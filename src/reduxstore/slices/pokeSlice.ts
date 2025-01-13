import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Poke interface
interface Poke {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

// State interface
interface PokesState {
  pokes: Poke[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PokesState = {
  pokes: [],
  loading: false,
  error: null,
};

// Async thunks for accept and reject actions
export const acceptPoke = createAsyncThunk(
  'pokes/acceptPoke',
  async (pokeId: string, { rejectWithValue }) => {
    console.log("POKESLICEID:", pokeId)
    try {
      //grabbing tokens for requests
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      const response = await axios.post(
        `http://localhost:5000/api/pokes/accept/${pokeId}`,
        { refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("POKESRes:", response)
      return { pokeId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error accepting poke');
    }
  }
);

export const rejectPoke = createAsyncThunk(
  'pokes/rejectPoke',
  async (pokeId: string, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      const response = await axios.post(
        `http://localhost:5000/api/pokes/reject/${pokeId}`,
        { refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return { pokeId, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error rejecting poke');
    }
  }
);

// Pokes slice
const pokesSlice = createSlice({
  name: 'pokes',
  initialState,
  reducers: {
    setPokes(state, action: PayloadAction<Poke[]>) {
      state.pokes = action.payload;
      state.loading = false;
    },
    clearPokes(state) {
      state.pokes = [];
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle accept poke
      .addCase(acceptPoke.pending, (state) => {
        console.log("accept poke pending...");
        state.loading = true;
      })
      .addCase(acceptPoke.fulfilled, (state, action) => {
        state.loading = false;
        const poke = state.pokes.find((p) => p.id === action.payload.pokeId);
        if (poke) poke.status = 'accepted';
      })
      .addCase(acceptPoke.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle reject poke
      .addCase(rejectPoke.pending, (state) => {
        console.log("Reject poke pending...");
        state.loading = true;
      })
      .addCase(rejectPoke.fulfilled, (state, action) => {
        console.log("Reject poke fulfil...");
        state.loading = false;
        state.pokes = state.pokes.filter((p) => p.id !== action.payload.pokeId);
      })
      .addCase(rejectPoke.rejected, (state, action) => {
        console.error("Reject poke rejected:", action.payload);
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { setPokes, clearPokes, setLoading } = pokesSlice.actions;
export default pokesSlice.reducer;
