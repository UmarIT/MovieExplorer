import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../services/movieApi';

interface FavoritesState {
  movies: Movie[];
}

const initialState: FavoritesState = {
  movies: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Movie>) => {
      if (!state.movies.find(movie => movie.id === action.payload.id)) {
        state.movies.push(action.payload);
        AsyncStorage.setItem('favorites', JSON.stringify(state.movies));
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.movies = state.movies.filter(movie => movie.id !== action.payload);
      AsyncStorage.setItem('favorites', JSON.stringify(state.movies));
    },
    setFavorites: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, setFavorites } = favoritesSlice.actions;

export const loadFavorites = () => async (dispatch: any) => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    if (favorites) {
      dispatch(setFavorites(JSON.parse(favorites)));
    }
  } catch (error) {
    console.error('Error loading favorites:', error);
  }
};

export default favoritesSlice.reducer; 