

import { createSelector } from 'reselect';
import { RootState } from './store';

// Selectors for matches
const selectMatchesState = (state: RootState) => state.matches;

export const selectMatches = createSelector(
  [selectMatchesState],
  (matchesState) => matchesState.matches // Extract matches array
);

// Selectors for pokes
const selectPokesState = (state: RootState) => state.pokes;

export const selectPokes = createSelector(
  [selectPokesState],
  (pokesState) => pokesState.pokes // Extract pokes array
);

// Selectors for pokes
const selectMessagessState = (state: RootState) => state.messages;

export const selectMessages = createSelector(
  [selectMessagessState],
  (messagesState) => messagesState.messages // Extract messages array
);