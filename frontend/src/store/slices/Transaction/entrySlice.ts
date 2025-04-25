import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EntryType } from "../../../types/transaction/entryType";
import axiosInstance, {
  handleAxiosError,
  handleAxiosErrorTyped,
} from "../../../api/axios";
import { CategoryType } from "../../../types/transaction/categoryType";
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
  (entry: EntryType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<ApiResponseType>(
        "entry/NewEntry",
        entry
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateEntry =
  (entry: EntryType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<EntryType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put<ApiResponseDataType<EntryType>>(
        "entry/UpdateEntry",
        entry
      );
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteEntry =
  (category: CategoryType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete<ApiResponseType>(
        "entry/DeleteEntry",
        {
          data: category,
        }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getEntry =
  (entry: EntryType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<EntryType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<ApiResponseDataType<EntryType>>(
        "entry/GetEntry",
        {
          params: entry,
        }
      );
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getEntryById =
  (entryId: number) =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<EntryType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<ApiResponseDataType<EntryType>>(
        `entry/GetEntryById/${entryId}`
      );
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const entryReducer = entrySlice.reducer;
