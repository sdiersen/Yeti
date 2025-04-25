import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountRoleType } from "../../../types/Identity/accountRole";
import axiosInstance, {
  handleAxiosError,
  handleAxiosErrorTyped,
} from "../../../api/axios";
import { AppDispatch } from "../..";
import {
  ApiResponseDataType,
  ApiResponseType,
} from "../../../types/api/apiResponseType";

interface LoadingState {
  loading: boolean;
}

const initialState: LoadingState = {
  loading: false,
};

const accountRoleSlce = createSlice({
  name: "accountRole",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = accountRoleSlce.actions;

export const newAccountRole =
  (acctRole: AccountRoleType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<ApiResponseType>(
        "accountRole/NewAccountRole",
        acctRole
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateAccountRole =
  (acctRole: AccountRoleType) =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<AccountRoleType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put<
        ApiResponseDataType<AccountRoleType>
      >("accountRole/UpdateAccountRole", acctRole);
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<AccountRoleType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteAccountRole =
  (acctRoleId: number) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete<ApiResponseType>(
        `accountRole/DeleteAccountRole/${acctRoleId}`
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAccountRole =
  (accountRole: AccountRoleType) =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<AccountRoleType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<AccountRoleType>
      >("accountRole/GetAccountRole", {
        params: accountRole,
      });
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<AccountRoleType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAccountRoleById =
  (acctRoleId: number) =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<AccountRoleType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<AccountRoleType>
      >(`accountRole/GetAccountRoleById/${acctRoleId}`);
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<AccountRoleType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const accountRoleReducer = accountRoleSlce.reducer;
