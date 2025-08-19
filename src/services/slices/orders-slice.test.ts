import { ordersSlice, fetchFeed, initialState } from './orders-slice';
import { TOrder } from '@utils-types';

describe('orders slice', () => {

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      status: 'done',
      name: 'Test Order 1',
      createdAt: '2024-01-01T10:00:00.000Z',
      updatedAt: '2024-01-01T10:30:00.000Z',
      number: 12345,
      ingredients: ['ingredient1', 'ingredient2']
    },
    {
      _id: '2',
      status: 'pending',
      name: 'Test Order 2',
      createdAt: '2024-01-01T11:00:00.000Z',
      updatedAt: '2024-01-01T11:15:00.000Z',
      number: 12346,
      ingredients: ['ingredient3', 'ingredient4']
    }
  ];

  const mockFeedResponse = {
    success: true,
    orders: mockOrders,
    total: 1000,
    totalToday: 50
  };

  describe('fetchFeed async thunk', () => {
    it('должен устанавливать loading в true при pending состоянии', () => {
      // Act
      const result = ordersSlice.reducer(
        initialState,
        fetchFeed.pending('requestId')
      );

      // Assert
      expect(result.loading).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('должен сохранять данные ленты при fulfilled состоянии', () => {
      // Arrange
      const loadingState = { ...initialState, loading: true };

      // Act
      const result = ordersSlice.reducer(
        loadingState,
        fetchFeed.fulfilled(mockFeedResponse, 'requestId')
      );

      // Assert
      expect(result.loading).toBe(false);
      expect(result.orders).toEqual(mockOrders);
      expect(result.total).toBe(1000);
      expect(result.totalToday).toBe(50);
      expect(result.error).toBeUndefined();
    });

    it('должен сохранять ошибку при rejected состоянии', () => {
      // Arrange
      const loadingState = { ...initialState, loading: true };
      const errorMessage = 'Failed to fetch feed';

      // Act
      const result = ordersSlice.reducer(
        loadingState,
        fetchFeed.rejected(
          new Error(errorMessage),
          'requestId',
          undefined,
          errorMessage
        )
      );

      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.orders).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalToday).toBe(0);
    });

    it('должен сохранять предыдущие данные при ошибке', () => {
      // Arrange
      const stateWithData = {
        orders: mockOrders,
        total: 500,
        totalToday: 25,
        loading: true,
        error: undefined
      };
      const errorMessage = 'Network timeout';

      // Act
      const result = ordersSlice.reducer(
        stateWithData,
        fetchFeed.rejected(
          new Error(errorMessage),
          'requestId',
          undefined,
          errorMessage
        )
      );

      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBe(errorMessage);
      expect(result.orders).toEqual(mockOrders); // Предыдущие данные сохранены
      expect(result.total).toBe(500);
      expect(result.totalToday).toBe(25);
    });

    it('должен обновлять данные при повторном успешном запросе', () => {
      // Arrange
      const stateWithOldData = {
        orders: [mockOrders[0]], // Только один заказ
        total: 100,
        totalToday: 5,
        loading: false,
        error: 'Previous error'
      };

      // Act
      const result = ordersSlice.reducer(
        stateWithOldData,
        fetchFeed.fulfilled(mockFeedResponse, 'requestId')
      );

      // Assert
      expect(result.loading).toBe(false);
      expect(result.error).toBeUndefined(); // Ошибка должна очищаться при успешном запросе
      expect(result.orders).toEqual(mockOrders); // Новые данные
      expect(result.total).toBe(1000);
      expect(result.totalToday).toBe(50);
    });
  });

  describe('начальное состояние', () => {
    it('должен иметь корректное начальное состояние', () => {
      // Act
      const result = ordersSlice.reducer(undefined, { type: 'unknown' });

      // Assert
      expect(result).toEqual(initialState);
    });
  });
});
