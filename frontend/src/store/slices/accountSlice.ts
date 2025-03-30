import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountType } from "../../types/Identity/accountType";
import axiosInstance, { isAxiosError } from "../../api/axios";

interface AccountState {
  accounts: AccountType[]; // List of accounts, current user is always index 0
  account: AccountType | null; // Current user account 
  messages: Record<string, string> | null; // messages are typically validation issues
  errors: Record<string, string> | null; // errors are typically server errors
  loading: boolean;
}

const initialState: AccountState = {
  accounts: [],
  account: null,
  messages: null,
  errors: null,
  loading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<AccountType[]>) => {
      state.accounts = action.payload;
    },
    setAccount: (state, action: PayloadAction<AccountType>) => {
      state.account = action.payload;
    },
    setMessages: (state, action: PayloadAction<Record<string, string>>) => {
      state.messages = action.payload;
    },
    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.errors = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAccounts, setAccount, setErrors, setLoading } = accountSlice.actions;

export const fetchAccounts = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get("account/GetAllAccounts");
    dispatch(setAccounts(response.data));
    dispatch(setAccount(response.data[0])); // Set the first account as the current user account
  } catch (error) {
    if (isAxiosError(error) && error.response?.data?.errors)
  }
}

export const newAccount = (account: AccountType) => async (dispatch: any) => {
  try {
    const response = await axiosInstance.post("account/NewAccount", account);
    dispatch(setAccount(response.data));
  } catch (error) {
    if (
      isAxiosError(error) &&
      error.response &&
      error.response.data &&
      error.response.data.errors
    ) {
      dispatch(setErrors(error.response.data.errors));
    } else {
      console.error("Account creation failed", error);
    }
  }
};

export default accountSlice.reducer;
