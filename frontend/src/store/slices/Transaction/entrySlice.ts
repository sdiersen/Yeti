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

export const getAllEntries =
  () =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<EntryType[]>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<EntryType[]>
      >("entry/GetAllEntries");
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<EntryType[]>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAllEntriesByItemId =
  (itemId: number) =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<EntryType[]>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<EntryType[]>
      >(`entry/GetAllEntriesByItemId/${itemId}`);
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<EntryType[]>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateEntry =
  (entry: EntryType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put<ApiResponseType>(
        `entry/UpdateEntry`,
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
