import { userSlice, loginUser, registerUser, getUser, logoutUser, initialState } from './user-slice';
import { TUser } from '@utils-types';

describe('user slice', () => {

  const mockUser: TUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  const mockResponse = {
    success: true,
    user: mockUser,
    accessToken: 'Bearer test-token',
    refreshToken: 'refresh-token'
  };

  describe('loginUser async thunk', () => {
    it('должен устанавливать loginUserRequest в true при pending', () => {
      // Act
      const result = userSlice.reducer(
        initialState,
        loginUser.pending('requestId', { email: 'test@test.com', password: 'password' })
      );

      // Assert
      expect(result.loginUserRequest).toBe(true);
      expect(result.loginUserError).toBeUndefined();
    });

    it('должен сохранять данные пользователя при successful login', () => {
      // Arrange
      const loadingState = { ...initialState, loginUserRequest: true };

      // Act
      const result = userSlice.reducer(
        loadingState,
        loginUser.fulfilled(mockResponse, 'requestId', { email: 'test@test.com', password: 'password' })
      );

      // Assert
      expect(result.loginUserRequest).toBe(false);
      expect(result.loginUserError).toBeUndefined();
      expect(result.data).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
    });

    it('должен сохранять ошибку при failed login', () => {
      // Arrange
      const loadingState = { ...initialState, loginUserRequest: true };
      const errorPayload = { success: false, message: 'Invalid credentials' };

      // Act
      const result = userSlice.reducer(
        loadingState,
        loginUser.rejected(null, 'requestId', { email: 'test@test.com', password: 'wrong' }, errorPayload)
      );

      // Assert
      expect(result.loginUserRequest).toBe(false);
      expect(result.loginUserError).toBe('Invalid credentials');
      expect(result.isAuthenticated).toBe(false);
    });
  });

  describe('getUser async thunk', () => {
    it('должен очищать getUserError при pending', () => {
      // Arrange
      const stateWithError = { ...initialState, getUserError: 'Previous error' };

      // Act
      const result = userSlice.reducer(
        stateWithError,
        getUser.pending('requestId')
      );

      // Assert
      expect(result.getUserError).toBeUndefined();
    });

    it('должен сохранять данные пользователя при successful getUser', () => {
      // Act
      const result = userSlice.reducer(
        initialState,
        getUser.fulfilled({ success: true, user: mockUser }, 'requestId')
      );

      // Assert
      expect(result.data).toEqual(mockUser);
      expect(result.isAuthenticated).toBe(true);
      expect(result.getUserError).toBeUndefined();
    });

    it('должен сохранять ошибку при failed getUser', () => {
      // Act
      const result = userSlice.reducer(
        initialState,
        getUser.rejected(null, 'requestId', undefined, 'Unauthorized')
      );

      // Assert
      expect(result.isAuthenticated).toBe(false);
      expect(result.getUserError).toBe('Unauthorized');
    });
  });

  describe('logoutUser async thunk', () => {
    it('должен устанавливать logoutUserRequest в true при pending', () => {
      // Act
      const result = userSlice.reducer(
        initialState,
        logoutUser.pending('requestId')
      );

      // Assert
      expect(result.logoutUserRequest).toBe(true);
      expect(result.logoutUserError).toBeUndefined();
    });

    it('должен очищать данные пользователя при successful logout', () => {
      // Arrange
      const authenticatedState = {
        ...initialState,
        data: mockUser,
        isAuthenticated: true,
        logoutUserRequest: true
      };

      // Act
      const result = userSlice.reducer(
        authenticatedState,
        logoutUser.fulfilled({ success: true }, 'requestId')
      );

      // Assert
      expect(result.data).toBeUndefined();
      expect(result.isAuthenticated).toBe(false);
      expect(result.logoutUserRequest).toBe(false);
      expect(result.logoutUserError).toBeUndefined();
    });
  });

  describe('setAuthChecked reducer', () => {
    it('должен устанавливать isAuthChecked в true', () => {
      // Act
      const result = userSlice.reducer(
        initialState,
        { type: 'user/setAuthChecked' }
      );

      // Assert
      expect(result.isAuthChecked).toBe(true);
    });
  });
});
