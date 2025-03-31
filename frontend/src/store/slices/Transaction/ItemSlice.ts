import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemType } from "../../../types/transaction/itemType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";

interface ItemState {
  item: ItemType | null;
  messages: string[]; // messages are typically validation issues
  errors: string[]; // errors are typically server errors
  success: boolean;
  loading: boolean;
}

const initialState: ItemState = {
  item: null,
  messages: [],
  errors: [],
  success: false,
  loading: false,
};

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setItem: (state, action: PayloadAction<ItemType | null>) => {
      state.item = action.payload;
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

export const { setItem, setMessages, setErrors, setSuccess, setLoading } =
  itemSlice.actions;

export const newItem = (item: ItemType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.post("item/NewItem", item);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setItem(data));
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

export const updateItem = (item: ItemType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.put("item/UpdateItem", item);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setItem(data));
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

export const deleteItem = (item: ItemType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.delete("item/DeleteItem", {
      data: item,
    });
    const { messages, errors, success } = response.data;
    if (success) {
      dispatch(setItem(null)); // Clear the item from state on successful deletion
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

export const getItem = (item: ItemType) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get("item/GetItem", { params: item });
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setItem(data));
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

export const getItemById = (itemId: number) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    const response = await axiosInstance.get(`item/GetItemById/${itemId}`);
    const { data, messages, errors, success } = response.data;

    if (success) {
      dispatch(setItem(data));
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

export const itemReducer = itemSlice.reducer;
