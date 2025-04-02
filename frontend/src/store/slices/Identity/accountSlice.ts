import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AccountType,
  defaultAccount,
} from "../../../types/Identity/accountType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";

interface AccountState {
  account: AccountType | null;
  messages: string[]; // messages are typically validation issues
  errors: string[]; // errors are typically server errors
  success: boolean;
  loading: boolean;
}

const initialState: AccountState = {
  account: null,
  messages: [],
  errors: [],
  success: false,
  loading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<AccountType | null>) => {
      state.account = action.payload;
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

export const { setAccount, setMessages, setErrors, setSuccess, setLoading } =
  accountSlice.actions;

export const newAccount =
  (username: string, password: string) => async (dispatch: any) => {
    dispatch(setLoading(true));
    let acct: AccountType = defaultAccount;
    acct.username = username;
    acct.password = password;
    try {
      const response = await axiosInstance.post("account/NewAccount", acct);
      const { data, messages, errors, success } = response.data;

      if (success) {
        dispatch(setAccount(data));
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

export const updateAccount = (acct: AccountType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.put("account/updateaccount", acct);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setAccount(data));
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

export const deleteAccount = (acct: AccountType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.delete("account/DeleteAccount", {
      data: acct,
    });
    const { messages, errors, success } = response.data;
    if (success) {
      dispatch(setAccount(null));
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

export const getAccount = (acct: AccountType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get("account/GetAccount", {
      params: acct,
    });
    const { data, messages, errors, success } = response.data;
    if (success) {
      dispatch(setAccount(data));
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

export const getAccountById = (id: number) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get(`account/GetAccountById/${id}`);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setAccount(data));
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

export const accountReducer = accountSlice.reducer;
