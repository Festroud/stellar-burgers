import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  collection: TIngredient[];
  loading: boolean;
  error: string | undefined;
};

export const fetchIngredients = createAsyncThunk<TIngredient[], undefined>(
  'ingredients/fetchIngredients',
  async function () {
    const data = await getIngredientsApi();
    return data;
  }
);

export const initialState: TIngredientsState = {
  collection: [],
  loading: false,
  error: undefined
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.collection = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});
