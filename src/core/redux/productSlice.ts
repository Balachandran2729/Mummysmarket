import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ProductsResponse, ProductsResponseSchema } from './datatype';
import { getApiBaseUrl } from '../common/api';

const API_BASE_URL = getApiBaseUrl();
const PRODUCTS_URL = `${API_BASE_URL}/drupal/web/api/user-crud/get-apps-data`;

interface ProductState {
  data: ProductsResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<
  ProductsResponse,
  { limit?: number; skip?: number },
  { rejectValue: string }
>(
  'products/fetchProducts',
  async ({ limit = 10, skip = 0 }, { rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await axios.get<ProductsResponse>(
        PRODUCTS_URL,
        {
          params: { limit, skip },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Validate response with Zod schema
      const validatedData = ProductsResponseSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      console.log('fetchProducts error:', error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || error.message || 'Failed to fetch products'
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.data = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products - Pending
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch Products - Fulfilled
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.skip === 0 || !state.data) {
          state.data = action.payload;
        } else {
          state.data = {
            ...action.payload,
            products: [...(state.data.products || []), ...action.payload.products],
          };
        }
      })
      // Fetch Products - Rejected
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      });
  },
});

export const { clearProducts, clearError } = productSlice.actions;
export default productSlice.reducer;
