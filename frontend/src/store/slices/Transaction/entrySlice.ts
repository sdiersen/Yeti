import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EntryType, EntryTypeDTO } from "../../../types/transaction/entryType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";
import { AppDispatch } from "../..";
import {
  ApiResponseDataType,
  ApiResponseType,
} from "../../../types/api/apiResponseType";

interface EntryState {
  entries: EntryType[];
  loading: boolean;
}

const initialState: EntryState = {
  entries: [],
  loading: false,
};

const entrySlice = createSlice({
  name: "entry",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEntries: (state, action: PayloadAction<EntryType[]>) => {
      state.entries = action.payload;
    },
    addEntry: (state, action: PayloadAction<EntryType>) => {
      state.entries.push(action.payload);
    },
    updateEntryInState: (state, action: PayloadAction<EntryType>) => {
      const index = state.entries.findIndex(
        (entry) => entry.id === action.payload.id
      );
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    deleteEntryFromState: (state, action: PayloadAction<number>) => {
      state.entries = state.entries.filter(
        (entry) => entry.id !== action.payload
      );
    },
  },
});

export const {
  setLoading,
  setEntries,
  addEntry,
  updateEntryInState,
  deleteEntryFromState,
} = entrySlice.actions;

export const fetchAllEntries =
  () =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<EntryType[]>
      >("/entry/GetAllEntries");
      if (response.data.success) {
        dispatch(setEntries(response.data.data));
      }
      return {
        success: response.data.success,
        messages: response.data.messages,
        errors: response.data.errors,
      } as ApiResponseType;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const createEntry =
  (entry: EntryTypeDTO) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<ApiResponseDataType<EntryType>>(
        "/entry/CreateEntry",
        entry
      );
      if (response.data.success) {
        dispatch(addEntry(response.data.data));
      }
      return {
        success: response.data.success,
        messages: response.data.messages,
        errors: response.data.errors,
      } as ApiResponseType;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateEntry =
  (entry: EntryType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put<ApiResponseDataType<EntryType>>(
        `/entry/UpdateEntry`,
        entry
      );
      if (response.data.success) {
        dispatch(updateEntryInState(response.data.data));
      }
      return {
        success: response.data.success,
        messages: response.data.messages,
        errors: response.data.errors,
      } as ApiResponseType;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const entryReducer = entrySlice.reducer;
