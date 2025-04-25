import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoleType } from "../../../types/Identity/roleType";
import axiosInstance, { handleAxiosErrorTyped } from "../../../api/axios";
import { ApiResponseDataType } from "../../../types/api/apiResponseType";
import { AppDispatch } from "../..";

interface RoleState {
  roles: RoleType[];
  loading: boolean;
}

const initialRoleState: RoleState = {
  roles: [],
  loading: false,
};

const roleSlice = createSlice({
  name: "role",
  initialState: initialRoleState,
  reducers: {
    setRoles: (state, action: PayloadAction<RoleType[]>) => {
      state.roles = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setRoles, setLoading } = roleSlice.actions;

export const getAllRoles = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get<ApiResponseDataType<RoleType[]>>(
      "/role/GetAllRoles"
    );
    const { data, success } = response.data;
    success ? dispatch(setRoles(data)) : dispatch(setRoles([]));
    return response.data;
  } catch (error) {
    return handleAxiosErrorTyped<RoleType[]>(error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const roleReducer = roleSlice.reducer;
