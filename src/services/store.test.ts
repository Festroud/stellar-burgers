import { combineSlices } from '@reduxjs/toolkit';
import { userSlice } from './slices/user-slice';
import { ingredientsSlice } from './slices/ingredients-slice';
import { constructorSlice } from './slices/constructor-slice';
import { ordersSlice } from './slices/orders-slice';

describe('rootReducer', () => {
  const rootReducer = combineSlices(
    userSlice,
    ingredientsSlice,
    constructorSlice,
    ordersSlice
  );

  it('должен возвращать корректное начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    // Arrange
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    // Act
    const result = rootReducer(undefined, unknownAction);

    // Assert
    expect(result).toEqual({
      user: {
        isAuthChecked: false,
        isAuthenticated: false,
        getUserRequest: false,
        getUserError: undefined,
        loginUserError: undefined,
        loginUserRequest: false,
        registerUserError: undefined,
        registerUserRequest: false,
        logoutUserError: undefined,
        logoutUserRequest: false,
        updateUserError: undefined,
        updateUserRequest: false,
        data: undefined,
        orders: [],
        ordersUserError: undefined,
        ordersUserRequest: false
      },
      ingredients: {
        collection: [],
        loading: false,
        error: undefined
      },
      burgerConstructor: {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      },
      orders: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: undefined
      }
    });
  });

  it('должен правильно обрабатывать состояние с существующими данными', () => {
    // Arrange
    const existingState = {
      user: {
        isAuthChecked: true,
        isAuthenticated: true,
        getUserRequest: false,
        getUserError: undefined,
        loginUserError: undefined,
        loginUserRequest: false,
        registerUserError: undefined,
        registerUserRequest: false,
        logoutUserError: undefined,
        logoutUserRequest: false,
        updateUserError: undefined,
        updateUserRequest: false,
        data: { email: 'test@test.com', name: 'Test User' },
        orders: [],
        ordersUserError: undefined,
        ordersUserRequest: false
      },
      ingredients: {
        collection: [
          {
            _id: '1',
            name: 'Test Ingredient',
            type: 'bun',
            proteins: 10,
            fat: 5,
            carbohydrates: 15,
            calories: 100,
            price: 200,
            image: 'test.png',
            image_large: 'test-large.png',
            image_mobile: 'test-mobile.png'
          }
        ],
        loading: false,
        error: undefined
      },
      burgerConstructor: {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderRequest: false,
        orderModalData: null
      },
      orders: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: undefined
      }
    };
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    // Act
    const result = rootReducer(existingState, unknownAction);

    // Assert
    expect(result).toEqual(existingState);
  });
});
