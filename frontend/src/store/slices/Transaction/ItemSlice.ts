import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemDTO, ItemType } from "../../../types/transaction/itemType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";
import { AppDispatch } from "../..";
import {
  ApiResponseDataType,
  ApiResponseType,
} from "../../../types/api/apiResponseType";

interface ItemState {
  items: ItemType[];
  loading: boolean;
}

const initialState: ItemState = {
  items: [],
  loading: false,
};

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setItems: (state, action: PayloadAction<ItemType[]>) => {
      state.items = action.payload;
    },
    addItem: (state, action: PayloadAction<ItemType>) => {
      state.items.push(action.payload);
    },
    updateItemInState: (state, action: PayloadAction<ItemType>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItemFromState: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setItems,
  addItem,
  updateItemInState,
  deleteItemFromState,
} = itemSlice.actions;

export const fetchAllItems =
  () =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<ApiResponseDataType<ItemType[]>>(
        "item/GetAllItems"
      );
      if (response.data.success) {
        dispatch(setItems(response.data.data));
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

export const createItem =
  (item: ItemDTO) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<ApiResponseDataType<ItemType>>(
        "item/NewItem",
        item
      );
      if (response.data.success) {
        dispatch(addItem(response.data.data));
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

export const updateItem =
  (item: ItemType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put<ApiResponseDataType<ItemType>>(
        "item/UpdateItem",
        item
      );
      if (response.data.success) {
        dispatch(updateItemInState(response.data.data));
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

export const deleteItem =
  (itemId: number) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete<ApiResponseType>(
        `item/DeleteItem/${itemId}`
      );
      if (response.data.success) {
        dispatch(deleteItemFromState(itemId));
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

export const itemReducer = itemSlice.reducer;
