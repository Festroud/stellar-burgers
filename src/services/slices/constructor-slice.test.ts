import { constructorSlice, addBun, addIngredient, removeIngredient, moveIngredient, clearOrder } from './constructor-slice';
import { TConstructorIngredient } from '@utils-types';

describe('constructor slice', () => {
  const initialState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null
  };

  const mockBun: TConstructorIngredient = {
    _id: '1',
    id: '1_123',
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
  };

  const mockIngredient: TConstructorIngredient = {
    _id: '2',
    id: '2_456',
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
  };

  const mockSauce: TConstructorIngredient = {
    _id: '3',
    id: '3_789',
    name: 'Test Sauce',
    type: 'sauce',
    proteins: 10,
    fat: 15,
    carbohydrates: 5,
    calories: 50,
    price: 100,
    image: 'test-sauce.png',
    image_large: 'test-sauce-large.png',
    image_mobile: 'test-sauce-mobile.png'
  };

  describe('добавление ингредиентов', () => {
    it('должен добавлять булку в конструктор', () => {
      // Act
      const result = constructorSlice.reducer(initialState, addBun(mockBun));

      // Assert
      expect(result.constructorItems.bun).toEqual(mockBun);
      expect(result.constructorItems.ingredients).toEqual([]);
    });

    it('должен заменять существующую булку при добавлении новой', () => {
      // Arrange
      const stateWithBun = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          bun: mockBun
        }
      };

      const newBun: TConstructorIngredient = {
        ...mockBun,
        _id: '4',
        id: '4_999',
        name: 'New Test Bun'
      };

      // Act
      const result = constructorSlice.reducer(stateWithBun, addBun(newBun));

      // Assert
      expect(result.constructorItems.bun).toEqual(newBun);
      expect(result.constructorItems.bun).not.toEqual(mockBun);
    });

    it('должен добавлять ингредиент в массив ingredients', () => {
      // Act
      const result = constructorSlice.reducer(initialState, addIngredient(mockIngredient));

      // Assert
      expect(result.constructorItems.ingredients).toHaveLength(1);
      expect(result.constructorItems.ingredients[0]).toEqual(mockIngredient);
      expect(result.constructorItems.bun).toBeNull();
    });

    it('должен добавлять несколько ингредиентов в массив', () => {
      // Arrange
      let state = constructorSlice.reducer(initialState, addIngredient(mockIngredient));

      // Act
      state = constructorSlice.reducer(state, addIngredient(mockSauce));

      // Assert
      expect(state.constructorItems.ingredients).toHaveLength(2);
      expect(state.constructorItems.ingredients[0]).toEqual(mockIngredient);
      expect(state.constructorItems.ingredients[1]).toEqual(mockSauce);
    });
  });

  describe('удаление ингредиентов', () => {
    it('должен удалять ингредиент по id', () => {
      // Arrange
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [mockIngredient, mockSauce]
        }
      };

      // Act
      const result = constructorSlice.reducer(stateWithIngredients, removeIngredient(mockIngredient.id));

      // Assert
      expect(result.constructorItems.ingredients).toHaveLength(1);
      expect(result.constructorItems.ingredients[0]).toEqual(mockSauce);
    });

    it('не должен изменять массив если ингредиент с таким id не найден', () => {
      // Arrange
      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [mockIngredient, mockSauce]
        }
      };

      // Act
      const result = constructorSlice.reducer(stateWithIngredients, removeIngredient('nonexistent-id'));

      // Assert
      expect(result.constructorItems.ingredients).toHaveLength(2);
      expect(result.constructorItems.ingredients).toEqual([mockIngredient, mockSauce]);
    });
  });

  describe('перемещение ингредиентов', () => {
    it('должен перемещать ингредиент вверх', () => {
      // Arrange
      const ingredient1: TConstructorIngredient = { ...mockIngredient, id: 'ing1' };
      const ingredient2: TConstructorIngredient = { ...mockSauce, id: 'ing2' };
      const ingredient3: TConstructorIngredient = { ...mockIngredient, id: 'ing3', name: 'Third Ingredient' };

      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [ingredient1, ingredient2, ingredient3]
        }
      };

      // Act - перемещаем второй ингредиент вверх
      const result = constructorSlice.reducer(
        stateWithIngredients,
        moveIngredient({ id: 'ing2', direction: 'up' })
      );

      // Assert
      expect(result.constructorItems.ingredients[0]).toEqual(ingredient2);
      expect(result.constructorItems.ingredients[1]).toEqual(ingredient1);
      expect(result.constructorItems.ingredients[2]).toEqual(ingredient3);
    });

    it('должен перемещать ингредиент вниз', () => {
      // Arrange
      const ingredient1: TConstructorIngredient = { ...mockIngredient, id: 'ing1' };
      const ingredient2: TConstructorIngredient = { ...mockSauce, id: 'ing2' };
      const ingredient3: TConstructorIngredient = { ...mockIngredient, id: 'ing3', name: 'Third Ingredient' };

      const stateWithIngredients = {
        ...initialState,
        constructorItems: {
          ...initialState.constructorItems,
          ingredients: [ingredient1, ingredient2, ingredient3]
        }
      };

      // Act - перемещаем первый ингредиент вниз
      const result = constructorSlice.reducer(
        stateWithIngredients,
        moveIngredient({ id: 'ing1', direction: 'down' })
      );

      // Assert
      expect(result.constructorItems.ingredients[0]).toEqual(ingredient2);
      expect(result.constructorItems.ingredients[1]).toEqual(ingredient1);
      expect(result.constructorItems.ingredients[2]).toEqual(ingredient3);
    });
  });

  describe('очистка заказа', () => {
    it('должен очищать конструктор и данные заказа', () => {
      // Arrange
      const stateWithData = {
        constructorItems: {
          bun: mockBun,
          ingredients: [mockIngredient, mockSauce]
        },
        orderRequest: true,
        orderModalData: {
          _id: 'test-order',
          status: 'done',
          name: 'Test Order',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
          number: 123,
          ingredients: ['1', '2', '3']
        }
      };

      // Act
      const result = constructorSlice.reducer(stateWithData, clearOrder());

      // Assert
      expect(result.constructorItems.bun).toBeNull();
      expect(result.constructorItems.ingredients).toEqual([]);
      expect(result.orderModalData).toBeNull();
      expect(result.orderRequest).toBeFalsy();
    });
  });
});
