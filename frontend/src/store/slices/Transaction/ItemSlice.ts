import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ItemDTO, ItemType } from "../../../types/transaction/itemType";
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

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = itemSlice.actions;

export const newItem =
  (item: ItemDTO) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<ApiResponseType>(
        "item/NewItem",
        item
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateItem =
  (item: ItemType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<ItemType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put<ApiResponseDataType<ItemType>>(
        "item/UpdateItem",
        item
      );
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteItem =
  (itemid: number) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete<ApiResponseType>(
        `item/DeleteItem/${itemid}`
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAllItems =
  () =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<ItemType[]>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<ApiResponseDataType<ItemType[]>>(
        "item/GetAllItems"
      );
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const itemReducer = itemSlice.reducer;
