import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EntryType, EntryTypeDTO } from "../../../types/transaction/entryType";
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

const entrySlice = createSlice({
  name: "entry",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = entrySlice.actions;

export const newEntry =
  (entry: EntryTypeDTO) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<ApiResponseType>(
        "entry/CreateEntry",
        entry
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const entryReducer = entrySlice.reducer;
