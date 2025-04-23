import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AccountType,
  LoginDTO,
  RegisterDTO,
  AccountLoggedInDTO,
  defaultAccountLoggedInDTO,
} from "../../../types/Identity/accountType";
import { ApiResponseDataType } from "../../../types/api/apiResponseType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";
import { AxiosError, isAxiosError } from "axios";

interface AccountState extends ApiResponseDataType<AccountLoggedInDTO> {
  loading: boolean;
}

const initialState: AccountState = {
  data: defaultAccountLoggedInDTO,
  messages: {},
  errors: {},
  success: false,
  loading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<AccountType>) => {
      state.data.account = action.payload;
    },
    setRoleNames: (state, action: PayloadAction<string[]>) => {
      state.data.roleNames = action.payload;
    },
    setMessages: (
      state,
      action: PayloadAction<{ [key: string]: string[] }>
    ) => {
      state.messages = action.payload;
    },
    setErrors: (state, action: PayloadAction<{ [key: string]: string[] }>) => {
      state.errors = action.payload;
    },
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.data = defaultAccountLoggedInDTO;
      state.messages = {};
      state.errors = {};
      state.success = false;
      state.loading = false;
    },
  },
});

export const {
  setAccount,
  setRoleNames,
  setMessages,
  setErrors,
  setSuccess,
  setLoading,
  logout,
} = accountSlice.actions;

export const newAccount =
  (username: string, password: string) => async (dispatch: any) => {
    dispatch(setLoading(true));
    let registerDTO: RegisterDTO = {
      username: username,
      password: password,
    };
    try {
      const response = await axiosInstance.post(
        "account/NewAccount",
        registerDTO
      );
      const { data, messages, errors, success } = response.data;

      if (success) {
        dispatch(setAccount(data));
      }
      dispatch(setMessages(messages || {}));
      dispatch(setErrors(errors || {}));
      dispatch(setSuccess(success));
      return response.data;
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
    dispatch(setMessages(messages || {}));
    dispatch(setErrors(errors || {}));
    dispatch(setSuccess(success));
  } catch (error) {
    handleAxiosError(error, dispatch, setErrors, setMessages, setSuccess);
  } finally {
    dispatch(setLoading(false));
  }
};

// This function is used to delete an account by its ID. This account is not the currently logged-in account.
// So it does not modify the current account in the store.
export const deleteAccount = (id: number) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.delete(`account/DeleteAccount/${id}`);
    const { messages, errors, success } = response.data;
    return { messages, errors, success };
  } catch (error) {
    if (isAxiosError(error)) {
      let errorMessage: string[] = []; //string array to hold error messages
      const { messages, errors, success } = error.response?.data;
      errorMessage.push(`Axios Message: ${error.message}`);
      if (error.code) {
        errorMessage.push(`Axios Code: ${error.code}`);
      }
      if (error.response?.status) {
        errorMessage.push(`Axios Status: ${error.response.status.toString()}`);
      }
      errors.push({ axioserrors: errorMessage });
      return { messages, errors, success };
    } else {
      const errors = { unknown: ["An unexpected error occurred."] };
      const success = false;
      const messages = { unkown: ["An unexpected error occurred."] };
      return { messages, errors, success };
    }
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
    dispatch(setMessages(messages || {}));
    dispatch(setErrors(errors || {}));
    dispatch(setSuccess(success));
  } catch (error) {
    handleAxiosError(error, dispatch, setErrors, setMessages, setSuccess);
  } finally {
    dispatch(setLoading(false));
  }
};

export const loginAccount =
  (username: string, password: string) =>
  async (dispatch: any): Promise<AccountState> => {
    dispatch(setLoading(true));
    let loginDTO: LoginDTO = {
      username: username,
      password: password,
    };
    try {
      const response = await axiosInstance.post<
        ApiResponseDataType<AccountLoggedInDTO>
      >("account/Login", loginDTO);
      const { data, messages, errors, success } = response.data;
      if (success) {
        dispatch(setAccount(data.account));
        dispatch(setRoleNames(data.roleNames));
      }
      dispatch(setMessages(messages || {}));
      dispatch(setErrors(errors || {}));
      dispatch(setSuccess(success));
      return {
        data,
        messages: messages || {},
        errors: errors || {},
        success: success,
        loading: false,
      };
    } catch (error) {
      const axiosError = error as AxiosError<AccountState>;
      handleAxiosError(
        axiosError,
        dispatch,
        setErrors,
        setMessages,
        setSuccess
      );
      return {
        data: axiosError.response?.data?.data || defaultAccountLoggedInDTO,
        messages: axiosError.response?.data?.messages || {},
        errors: axiosError.response?.data?.errors || {},
        success: false,
        loading: false,
      };
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
    dispatch(setMessages(messages || {}));
    dispatch(setErrors(errors || {}));
    dispatch(setSuccess(success));
  } catch (error) {
    handleAxiosError(error, dispatch, setErrors, setMessages, setSuccess);
  } finally {
    dispatch(setLoading(false));
  }
};

export const accountReducer = accountSlice.reducer;
