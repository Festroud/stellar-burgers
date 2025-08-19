import { ingredientsSlice, fetchIngredients } from './ingredients-slice';
import { TIngredient } from '@utils-types';

describe('ingredients slice', () => {
  const initialState = {
    collection: [],
    loading: false,
    error: undefined
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Test Bun',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'test-bun.png',
      image_large: 'test-bun-large.png',
      image_mobile: 'test-bun-mobile.png'
    },
    {
      _id: '2',
      name: 'Test Ingredient',
      type: 'main',
      proteins: 100,
      fat: 50,
      carbohydrates: 25,
      calories: 300,
      price: 500,
      image: 'test-ingredient.png',
      image_large: 'test-ingredient-large.png',
      image_mobile: 'test-ingredient-mobile.png'
    }
  ];

  describe('fetchIngredients async thunk', () => {
    it('должен устанавливать loading в true при pending состоянии', () => {
      // Act
      const result = ingredientsSlice.reducer(
        initialState,
        fetchIngredients.pending('requestId', undefined)
      );

      // Assert
      expect(result.loading).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.collection).toEqual([]);
    });

    it('должен сохранять ингредиенты и устанавливать loading в false при fulfilled состоянии', () => {
      // Arrange
      const loadingState = {
        collection: [],
        loading: true,
        error: undefined
      };

      // Act
      const result = ingredientsSlice.reducer(
        loadingState,
        fetchIngredients.fulfilled(mockIngredients, 'requestId', undefined)
      );

      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBeUndefined();
      expect(result.collection).toEqual(mockIngredients);
      expect(result.collection).toHaveLength(2);
    });

    it('должен сохранять ошибку и устанавливать loading в false при rejected состоянии', () => {
      // Arrange
      const loadingState = {
        collection: [],
        loading: true,
        error: undefined
      };

      const errorMessage = 'Network Error: Failed to fetch ingredients';

      // Act
      const result = ingredientsSlice.reducer(
        loadingState,
        fetchIngredients.rejected(
          new Error(errorMessage),
          'requestId',
          undefined,
          errorMessage
        )
      );

      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.collection).toEqual([]);
    });

    it('должен сохранять существующие данные при ошибке', () => {
      // Arrange
      const stateWithData = {
        collection: mockIngredients,
        loading: true,
        error: undefined
      };

      const errorMessage = 'Connection timeout';

      // Act
      const result = ingredientsSlice.reducer(
        stateWithData,
        fetchIngredients.rejected(
          new Error(errorMessage),
          'requestId',
          undefined,
          errorMessage
        )
      );

      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.collection).toEqual(mockIngredients); // Данные остаются
    });

    it('должен очищать ошибку при повторном запросе', () => {
      // Arrange
      const stateWithError = {
        collection: [],
        loading: false,
        error: 'Previous error'
      };

      // Act
      const result = ingredientsSlice.reducer(
        stateWithError,
        fetchIngredients.pending('requestId', undefined)
      );

      // Assert
      expect(result.loading).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.collection).toEqual([]);
    });

    it('должен обновлять данные при повторном успешном запросе', () => {
      // Arrange
      const stateWithOldData = {
        collection: [mockIngredients[0]], // Только один ингредиент
        loading: false,
        error: undefined
      };

      // Act
      const result = ingredientsSlice.reducer(
        stateWithOldData,
        fetchIngredients.fulfilled(mockIngredients, 'requestId', undefined) // Все ингредиенты
      );

      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBeUndefined();
      expect(result.collection).toEqual(mockIngredients);
      expect(result.collection).toHaveLength(2);
    });
  });

  describe('начальное состояние', () => {
    it('должен иметь корректное начальное состояние', () => {
      // Act
      const result = ingredientsSlice.reducer(undefined, { type: 'unknown' });

      // Assert
      expect(result).toEqual(initialState);
    });
  });
});
