import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Product } from './datatype';
import type { AppDispatch, RootState } from './store';

interface FavoritesState {
  items: Product[];
}

const initialState: FavoritesState = { items: [] };
const FAVORITES_KEY = '@mummysmarket/favorites';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    toggleFavoriteInState(state, action: PayloadAction<Product>) {
      const exists = state.items.some((p) => p.id === action.payload.id);
      state.items = exists
        ? state.items.filter((p) => p.id !== action.payload.id)
        : [...state.items, action.payload];
    },
  },
});

export const { setFavorites, toggleFavoriteInState } = favoritesSlice.actions;
export default favoritesSlice.reducer;

export const loadFavorites = () => async (dispatch: AppDispatch) => {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (raw) dispatch(setFavorites(JSON.parse(raw)));
  } catch (e) {
    console.log('Failed to load favorites', e);
  }
};

export const toggleFavorite =
  (product: Product) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(toggleFavoriteInState(product));
    try {
      const { favorites } = getState();
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.items));
    } catch (e) {
      console.log('Failed to persist favorites', e);
    }
  };