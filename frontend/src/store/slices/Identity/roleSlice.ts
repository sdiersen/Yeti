import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoleType } from "../../../types/Identity/roleType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";

interface RoleState {
  role: RoleType | null; // Current user role
  messages: string[]; // messages are typically validation issues
  errors: string[]; // errors are typically server errors
  success: boolean;
  loading: boolean;
}

const initialState: RoleState = {
  role: null,
  messages: [],
  errors: [],
  success: false,
  loading: false,
};

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<RoleType | null>) => {
      state.role = action.payload;
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

export const { setRole, setMessages, setErrors, setSuccess, setLoading } =
  roleSlice.actions;

export const newRole = (role: RoleType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.post("role/NewRole", role);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setRole(data));
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

export const updateRole = (role: RoleType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.put("role/UpdateRole", role);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setRole(data));
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

export const deleteRole = (role: RoleType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.delete("role/DeleteRole", {
      data: role,
    });
    const { messages, errors, success } = response.data;

    if (success) {
      dispatch(setRole(null)); // Clear the role from state
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

export const getRole = (role: RoleType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get("role/GetRole", {
      params: role,
    });
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setRole(data));
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

export const getRoleById = (roleId: number) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get(`role/getrolebyid/${roleId}`);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setRole(data));
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

export const roleReducer = roleSlice.reducer;
