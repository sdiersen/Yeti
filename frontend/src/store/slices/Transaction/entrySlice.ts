import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EntryType } from "../../../types/transaction/entryType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";
import { CategoryType } from "../../../types/transaction/categoryType";

interface EntryState {
  entry: EntryType | null;
  messages: string[]; // messages are typically validation issues
  errors: string[]; // errors are typically server errors
  success: boolean;
  loading: boolean;
}

const initialState: EntryState = {
  entry: null,
  messages: [],
  errors: [],
  success: false,
  loading: false,
};

const entrySlice = createSlice({
  name: "entry",
  initialState,
  reducers: {
    setEntry: (state, action: PayloadAction<EntryType | null>) => {
      state.entry = action.payload;
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

export const { setEntry, setMessages, setErrors, setSuccess, setLoading } =
  entrySlice.actions;

export const newEntry = (entry: EntryType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.post("entry/NewEntry", entry);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setEntry(data));
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

export const updateEntry = (entry: EntryType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.put("entry/UpdateEntry", entry);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setEntry(data));
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

export const deleteEntry =
  (category: CategoryType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete("entry/DeleteEntry", {
        data: category,
      });
      const { messages, errors, success } = response.data;
      if (success) {
        dispatch(setEntry(null));
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

export const getEntry = (entry: EntryType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get("entry/GetEntry", {
      params: entry,
    });
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setEntry(data));
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

export const getEntryById = (entryId: number) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get(`entry/GetEntryById/${entryId}`);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setEntry(data));
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

export const entryReducer = entrySlice.reducer;
