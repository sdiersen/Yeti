import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDataType } from "../../../types/Identity/userDataType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";

interface UserDataState {
  userData: UserDataType | null;
  messages: string[]; // messages are typically validation issues
  errors: string[]; // errors are typically server errors
  success: boolean;
  loading: boolean;
}

const initialState: UserDataState = {
  userData: null,
  messages: [],
  errors: [],
  success: false,
  loading: false,
};

const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserDataType | null>) => {
      state.userData = action.payload;
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

export const { setUserData, setMessages, setErrors, setSuccess, setLoading } =
  userDataSlice.actions;

export const NewUserData =
  (userData: UserDataType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post(
        "userData/NewUserData",
        userData
      );
      const { data, messages, errors, success } = response.data;
      if (success) {
        dispatch(setUserData(data));
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

export const updateUserData =
  (userData: UserDataType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post(
        "userData/UpdateUserData",
        userData
      );
      const { data, messages, errors, success } = response.data;
      if (success) {
        dispatch(setUserData(data));
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

export const deleteUserData =
  (userData: UserDataType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete("userData/DeleteUserData", {
        data: userData,
      });
      const { messages, errors, success } = response.data;
      if (success) {
        dispatch(setUserData(null));
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

export const getUserData = (user: UserDataType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get("userData/GetUserData", {
      params: user,
    });
    const { data, messages, errors, success } = response.data;
    if (success) {
      dispatch(setUserData(data));
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

export const getUserDataById = (userId: number) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get(
      `serData/GetUserDataById/${userId}`
    );
    const { data, messages, errors, success } = response.data;
    if (success) {
      dispatch(setUserData(data));
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

export const userDataReducer = userDataSlice.reducer;
