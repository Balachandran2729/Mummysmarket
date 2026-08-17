import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { ProductsResponse, ProductsResponseSchema } from './datatype';

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
      const response = await axios.get<ProductsResponse>(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
      );

      // Validate response with Zod schema
      const validatedData = ProductsResponseSchema.parse(response.data);
      return validatedData;
    } catch (error) {
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
        state.data = action.payload;
        state.error = null;
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
