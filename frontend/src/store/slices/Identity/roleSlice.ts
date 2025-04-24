import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoleType } from "../../../types/Identity/roleType";
import axiosInstance, { isAxiosError } from "../../../api/axios";
import { ApiResponseDataType } from "../../../types/api/apiResponseType";

interface RoleState {
  roles: RoleType[];
  loading: boolean;
}

const initialRoleState: RoleState = {
  roles: [],
  loading: false,
};

interface responseDataType {
  data: RoleType[];
  messages: { [key: string]: string[] };
  errors: { [key: string]: string[] };
  success: boolean;
}

const initialResponseData: responseDataType = {
  data: [],
  messages: {},
  errors: {},
  success: false,
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

export const getAllRoles = () => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get<ApiResponseDataType<RoleType[]>>(
      "/role/GetAllRoles"
    );
    const { data, success } = response.data;
    success ? dispatch(setRoles(data)) : dispatch(setRoles([]));
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Axios error:", error.message);
      console.error("Axios error code:", error.code);
      console.error("Axios error response:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    return initialResponseData;
  } finally {
    dispatch(setLoading(false));
  }
};

export const roleReducer = roleSlice.reducer;
