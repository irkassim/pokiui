import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, PeopleState, FetchPeopleArgs } from '../../types/peopleType'; // Import types

// Async thunk for fetching users
export const fetchPeople = createAsyncThunk<
  { users: User[]; currentPage: number; totalPages: number }, // Success response type
  FetchPeopleArgs, // Arguments type
  { rejectValue: string } // Error response type
>(
  'people/fetchPeople',
  async ({ userId, latitude, longitude, page }, { rejectWithValue }) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log(userId, latitude,longitude,page)

    const url = `http://localhost:5000/api/users/people?userId=${userId}&latitude=${latitude}&longitude=${longitude}&page=${page}`;
    try {
      const response = await axios.get(url, {
      
        headers: { Authorization: `Bearer ${accessToken}` } 
      });

      console.log("The Response:", response)
      return response.data; // Fetched users
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error fetching people');
    }
  }
);

const initialState: PeopleState = {
  users: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    resetPeople: (state) => {
      state.users = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPeople.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPeople.fulfilled, (state, { payload }) => {
        // Avoid duplicates
        const existingUserIds = new Set(state.users.map((user:any) => user._id));
        const newUsers = payload.users.filter((user:any) => !existingUserIds.has(user._id));

        // Append unique users
        state.users = [...state.users, ...newUsers];
        state.currentPage = payload.currentPage ?? state.currentPage;
        state.totalPages = payload.totalPages ?? state.totalPages;
        state.loading = false;
      })
      .addCase(fetchPeople.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch people';
      });
  },
});

export const { resetPeople } = peopleSlice.actions;
export default peopleSlice.reducer;
