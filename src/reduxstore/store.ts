import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import userReducer from './slices/userSlice';
import matchesReducer from './slices/matchSlice';
import pokesReducer from './slices/pokeSlice';
import messagesReducer from './slices/messageSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    matches: matchesReducer,
    pokes: pokesReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
