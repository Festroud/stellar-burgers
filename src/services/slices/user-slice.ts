import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

interface UserState {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  getUserRequest: boolean;
  getUserError: string | undefined;
  loginUserError: string | undefined;
  loginUserRequest: boolean;
  registerUserError: string | undefined;
  registerUserRequest: boolean;
  logoutUserError: string | undefined;
  logoutUserRequest: boolean;
  data: TUser | undefined;
  orders: TOrder[];
  ordersUserError: string | undefined;
  ordersUserRequest: boolean;
  updateUserError: string | undefined;
  updateUserRequest: boolean;
}

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(credentials);

      if (!response?.success) {
        return rejectWithValue(response);
      }

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(userData);

      if (!response?.success) {
        return rejectWithValue(response);
      }

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      if (response?.success) {
        return response;
      }
      return rejectWithValue(response);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(userData);
      if (!response.success) {
        return rejectWithValue(response);
      }
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await logoutApi();
      if (!response?.success) {
        return rejectWithValue(response);
      }
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return response;
    } catch (error) {
      rejectWithValue(error);
    }
  }
);

export const getOrders = createAsyncThunk(
  'user/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOrdersApi();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const initialState: UserState = {
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
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginUserError = undefined;
        state.loginUserRequest = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginUserRequest = false;
        state.loginUserError = undefined;
        state.data = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        if (action.payload) {
          const payload = action.payload as {
            success: boolean;
            message: string;
          };
          state.loginUserError = payload.message;
        }
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerUserError = undefined;
        state.registerUserRequest = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerUserRequest = false;
        state.registerUserError = undefined;
        state.data = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserRequest = false;
        if (action.payload) {
          const payload = action.payload as {
            success: boolean;
            message: string;
          };
          state.registerUserError = payload.message;
        }
        state.isAuthenticated = false;
      })
      .addCase(getUser.pending, (state) => {
        state.getUserError = undefined;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload?.user;
        state.isAuthenticated = true;
        state.getUserError = undefined;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.getUserError = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutUserRequest = true;
        state.logoutUserError = undefined;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = undefined;
        state.isAuthenticated = false;
        state.logoutUserRequest = false;
        state.logoutUserError = undefined;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutUserRequest = false;
        state.logoutUserError = action.payload as string;
      })
      .addCase(getOrders.pending, (state) => {
        state.ordersUserRequest = true;
        state.ordersUserError = undefined;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload as TOrder[];
        state.ordersUserRequest = false;
        state.ordersUserError = undefined;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.ordersUserRequest = false;
        state.ordersUserError = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.updateUserRequest = true;
        state.updateUserError = undefined;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.updateUserRequest = false;
        state.updateUserError = undefined;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserRequest = false;
        state.updateUserError = action.payload as string;
      });
  }
});

export const { setAuthChecked } = userSlice.actions;
