import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TOrder,
  TConstructorItems
} from '@utils-types';

interface ConstructorState {
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

// Action creators для генерации UUID
export const addBunAction = (
  ingredient: Omit<TConstructorIngredient, 'id'>
) => {
  const ingredientWithId = {
    ...ingredient,
    id: `${ingredient._id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  return addBun(ingredientWithId);
};

export const addIngredientAction = (
  ingredient: Omit<TConstructorIngredient, 'id'>
) => {
  const ingredientWithId = {
    ...ingredient,
    id: `${ingredient._id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  return addIngredient(ingredientWithId);
};

export const orderBurger = createAsyncThunk(
  'orders/orderBurger',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);

      if (!response.success) {
        return rejectWithValue(response);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState: ConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.bun = action.payload;
    },
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructorItems.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' }>
    ) => {
      const ingredients = state.constructorItems.ingredients;
      const currentIndex = ingredients.findIndex(
        (el) => el.id === action.payload.id
      );
      const ingredient = ingredients[currentIndex];

      ingredients.splice(currentIndex, 1);

      if (action.payload.direction === 'up') {
        ingredients.splice(currentIndex - 1, 0, ingredient);
      } else {
        ingredients.splice(currentIndex + 1, 0, ingredient);
      }
    },
    clearOrder: (state) => {
      state.constructorItems = { bun: null, ingredients: [] };
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
        // Очищаем конструктор после успешного заказа
        state.constructorItems = { bun: null, ingredients: [] };
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearOrder
} = constructorSlice.actions;
