import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDataType } from "../../../types/Identity/userDataType";
import axiosInstance, {
  handleAxiosError,
  handleAxiosErrorTyped,
} from "../../../api/axios";
import { AppDispatch } from "../..";
import {
  ApiResponseDataType,
  ApiResponseType,
} from "../../../types/api/apiResponseType";

interface UserDataState {
  userData: UserDataType | null;
  loading: boolean;
}

const initialState: UserDataState = {
  userData: null,
  loading: false,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserDataType | null>) => {
      state.userData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserData, setLoading } = userDataSlice.actions;

export const NewUserData =
  (userData: UserDataType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<ApiResponseType>(
        "userData/NewUserData",
        userData
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateUserData =
  (userData: UserDataType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<UserDataType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<
        ApiResponseDataType<UserDataType>
      >("userData/UpdateUserData", userData);
      const { data, success } = response.data;
      if (success) {
        dispatch(setUserData(data));
      }
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<UserDataType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteUserData =
  (userData: UserDataType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete<ApiResponseType>(
        "userData/DeleteUserData",
        {
          data: userData,
        }
      );
      const { success } = response.data;
      if (success) {
        dispatch(setUserData(null));
      }
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getUserData =
  (user: UserDataType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<UserDataType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<UserDataType>
      >("userData/GetUserData", {
        params: user,
      });
      const { data, success } = response.data;
      if (success) {
        dispatch(setUserData(data));
      }
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<UserDataType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getUserDataById =
  (userId: number) =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<UserDataType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<UserDataType>
      >(`serData/GetUserDataById/${userId}`);
      const { data, success } = response.data;
      if (success) {
        dispatch(setUserData(data));
      }
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<UserDataType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const userDataReducer = userDataSlice.reducer;
