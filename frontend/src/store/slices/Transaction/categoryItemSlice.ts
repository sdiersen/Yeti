import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryItemType } from "../../../types/transaction/categoryItemType";
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

const categoryItemSlice = createSlice({
  name: "categoryItem",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = categoryItemSlice.actions;

export const newCategoryItem =
  (categoryItem: CategoryItemType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<ApiResponseType>(
        "categoryItem/NewCategoryItem",
        categoryItem
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateCategoryItem =
  (categoryItem: CategoryItemType) =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<CategoryItemType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put<
        ApiResponseDataType<CategoryItemType>
      >("categoryItem/UpdateCategoryItem", categoryItem);
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<CategoryItemType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteCategoryItem =
  (categoryItem: CategoryItemType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete<ApiResponseType>(
        "categoryItem/DeleteCategoryItem",
        { data: categoryItem }
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getCategoryItem =
  (categoryItem: CategoryItemType) =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<CategoryItemType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<CategoryItemType>
      >("categoryItem/GetCategoryItem", {
        params: categoryItem,
      });
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<CategoryItemType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getCategoryItemById =
  (categoryItemId: number) =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<CategoryItemType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<CategoryItemType>
      >(`categoryItem/GetCategoryItems/${categoryItemId}`);
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<CategoryItemType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const categoryItemReducer = categoryItemSlice.reducer;
