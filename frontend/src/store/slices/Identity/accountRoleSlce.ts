import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountRoleType } from "../../../types/Identity/accountRole";
import axiosInstance, { handleAxiosError } from "../../../api/axios";

interface AccountRoleState {
  accountRole: AccountRoleType | null;
  messages: string[]; // messages are typically validation issues
  errors: string[]; // errors are typically server errors
  success: boolean;
  loading: boolean;
}

const initialState: AccountRoleState = {
  accountRole: null,
  messages: [],
  errors: [],
  success: false,
  loading: false,
};

const accountRoleSlce = createSlice({
  name: "accountRole",
  initialState,
  reducers: {
    setAccountRole: (state, action: PayloadAction<AccountRoleType | null>) => {
      state.accountRole = action.payload;
    },
    setMessages: (state, action: PayloadAction<string[]>) => {
      state.messages = action.payload;
    },
    setErrors: (state, action: PayloadAction<string[]>) => {
      state.errors = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setAccountRole,
  setMessages,
  setErrors,
  setSuccess,
  setLoading,
} = accountRoleSlce.actions;

export const newAccountRole =
  (acctRole: AccountRoleType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post(
        "accountRole/NewAccountRole",
        acctRole
      );
      const { data, messages, errors, success } = response.data;
      if (success) {
        dispatch(setAccountRole(data));
      }
      dispatch(setMessages(messages || []));
      dispatch(setErrors(errors || []));
      dispatch(setSuccess(success));
    } catch (error) {
      handleAxiosError(error, dispatch, setErrors, setMessages, setSuccess);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateAccountRole =
  (acctRole: AccountRoleType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put(
        "accountRole/UpdateAccountRole",
        acctRole
      );
      const { data, messages, errors, success } = response.data;
      if (success) {
        dispatch(setAccountRole(data));
      }
      dispatch(setMessages(messages || []));
      dispatch(setErrors(errors || []));
      dispatch(setSuccess(success));
    } catch (error) {
      handleAxiosError(error, dispatch, setErrors, setMessages, setSuccess);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteAccountRole =
  (acctRoleId: number) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete(
        `accountRole/DeleteAccountRole/${acctRoleId}`
      );
      const { messages, errors, success } = response.data;
      if (success) {
        dispatch(setAccountRole(null));
      }
      dispatch(setMessages(messages || []));
      dispatch(setErrors(errors || []));
      dispatch(setSuccess(success));
    } catch (error) {
      handleAxiosError(error, dispatch, setErrors, setMessages, setSuccess);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAccountRole =
  (accountRole: AccountRoleType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get("accountRole/GetAccountRole", {
        params: accountRole,
      });
      const { data, messages, errors, success } = response.data;
      if (success) {
        dispatch(setAccountRole(data));
      }
      dispatch(setMessages(messages || []));
      dispatch(setErrors(errors || []));
      dispatch(setSuccess(success));
    } catch (error) {
      handleAxiosError(error, dispatch, setErrors, setMessages, setSuccess);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAccountRoleById =
  (acctRoleId: number) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get(
        `accountRole/GetAccountRoleById/${acctRoleId}`
      );
      const { data, messages, errors, success } = response.data;
      if (success) {
        dispatch(setAccountRole(data));
      }
      dispatch(setMessages(messages || []));
      dispatch(setErrors(errors || []));
      dispatch(setSuccess(success));
    } catch (error) {
      handleAxiosError(error, dispatch, setErrors, setMessages, setSuccess);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const accountRoleReducer = accountRoleSlce.reducer;
