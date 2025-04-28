import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AccountType,
  LoginDTO,
  RegisterDTO,
  AccountLoggedInDTO,
  defaultAccountLoggedInDTO,
  UpdateAccountDTO,
} from "../../../types/Identity/accountType";
import {
  ApiResponseDataType,
  ApiResponseType,
} from "../../../types/api/apiResponseType";
import axiosInstance, {
  handleAxiosError,
  handleAxiosErrorTyped,
} from "../../../api/axios";
import { AppDispatch } from "../..";

interface AccountState {
  data: AccountLoggedInDTO;
  loading: boolean;
}

const initialState: AccountState = {
  data: defaultAccountLoggedInDTO,
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.data = defaultAccountLoggedInDTO;
      state.loading = false;
    },
  },
});

export const { setAccount, setRoleNames, setLoading, logout } =
  accountSlice.actions;

export const newAccount =
  (username: string, password: string) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    let registerDTO: RegisterDTO = {
      username: username,
      password: password,
    };
    try {
      const response = await axiosInstance.post<ApiResponseType>(
        "account/NewAccount",
        registerDTO
      );
      //creating a new account does not set the account that is logged in. It just returns the response.
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const adminCreateAccount =
  (newAccount: UpdateAccountDTO) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<ApiResponseType>(
        "account/AdminCreateAccount",
        newAccount
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateAccount =
  (acct: UpdateAccountDTO) =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<AccountLoggedInDTO>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put<
        ApiResponseDataType<AccountLoggedInDTO>
      >("account/updateaccount", acct);
      const { data, success } = response.data;
      if (success) {
        dispatch(setAccount(data.account));
        dispatch(setRoleNames(data.roleNames));
      }
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<AccountLoggedInDTO>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

// This function is used to delete an account by its ID. This account is not the currently logged-in account.
// So it does not modify the current account in the store.
export const deleteAccount =
  (id: number) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete<ApiResponseType>(
        `account/DeleteAccount/${id}`
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAccount =
  (acct: AccountType) =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<AccountLoggedInDTO>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<AccountLoggedInDTO>
      >("account/GetAccount", {
        params: acct,
      });
      const { data, success } = response.data;
      if (success) {
        dispatch(setAccount(data.account));
        dispatch(setRoleNames(data.roleNames));
      }
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<AccountLoggedInDTO>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const loginAccount =
  (username: string, password: string) =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<AccountLoggedInDTO>> => {
    dispatch(setLoading(true));
    let loginDTO: LoginDTO = {
      username: username,
      password: password,
    };
    try {
      const response = await axiosInstance.post<
        ApiResponseDataType<AccountLoggedInDTO>
      >("account/Login", loginDTO);
      const { data, success } = response.data;
      if (success) {
        dispatch(setAccount(data.account));
        dispatch(setRoleNames(data.roleNames));
      }
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<AccountLoggedInDTO>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAccountById =
  (id: number) =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<AccountLoggedInDTO>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<AccountLoggedInDTO>
      >(`account/GetAccountById/${id}`);
      const { data, success } = response.data;

      if (success) {
        dispatch(setAccount(data.account));
        dispatch(setRoleNames(data.roleNames));
      }
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<AccountLoggedInDTO>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const accountReducer = accountSlice.reducer;
