import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CategoryDTO,
  CategoryType,
} from "../../../types/transaction/categoryType";
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

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = categorySlice.actions;

export const newCategory =
  (category: CategoryDTO) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<ApiResponseType>(
        "category/NewCategory",
        category
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateCategory =
  (category: CategoryType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put<ApiResponseType>(
        "category/UpdateCategory",
        category
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteCategory =
  (categoryId: number) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete<ApiResponseType>(
        `category/DeleteCategory/${categoryId}`
      );
      return response.data;
    } catch (error) {
      return handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getCategory =
  (category: CategoryType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<CategoryType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<CategoryType>
      >("category/GetCategory", {
        params: category,
      });
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<CategoryType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getAllCategories =
  () =>
  async (
    dispatch: AppDispatch
  ): Promise<ApiResponseDataType<CategoryType[]>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<CategoryType[]>
      >("category/GetAllCategories");
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<CategoryType[]>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getCategoryById =
  (categoryId: number) =>
  async (dispatch: AppDispatch): Promise<ApiResponseDataType<CategoryType>> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<CategoryType>
      >(`category/GetCategoryById/${categoryId}`);
      return response.data;
    } catch (error) {
      return handleAxiosErrorTyped<CategoryType>(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const categoryReducer = categorySlice.reducer;
