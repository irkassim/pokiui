import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}


interface UserState {
  user: {
    user: UserProfile | null // Adjust to include the nested `user` object
  } | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}


const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk<UserProfile>(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      /* const accessToken = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
          }); */
          console.log("USERSLICEUSER:STARTING", )
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      const response = await axios.post(
        `http://localhost:5000/api/profile/user`,
        {  refreshToken},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log("USERSLICEUSER:", response.data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action: PayloadAction<any>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
