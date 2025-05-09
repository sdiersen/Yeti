import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CategoryDTO,
  CategoryType,
} from "../../../types/transaction/categoryType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";
import { AppDispatch } from "../..";
import {
  ApiResponseDataType,
  ApiResponseType,
} from "../../../types/api/apiResponseType";

interface CategoryState {
  categories: CategoryType[];
  loading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCategories: (state, action: PayloadAction<CategoryType[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<CategoryType>) => {
      state.categories.push(action.payload);
    },
    updateCategoryInState: (state, action: PayloadAction<CategoryType>) => {
      const index = state.categories.findIndex(
        (category) => category.id === action.payload.id
      );
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategoryFromState: (state, action: PayloadAction<number>) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload
      );
    },
  },
});

export const {
  setLoading,
  setCategories,
  addCategory,
  updateCategoryInState,
  deleteCategoryFromState,
} = categorySlice.actions;

export const fetchAllCategories =
  () =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get<
        ApiResponseDataType<CategoryType[]>
      >("category/GetAllCategories");
      if (response.data.success) {
        dispatch(setCategories(response.data.data));
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

export const createCategory =
  (category: CategoryDTO) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post<
        ApiResponseDataType<CategoryType>
      >("category/NewCategory", category);
      if (response.data.success) {
        dispatch(addCategory(response.data.data));
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

export const updateCategory =
  (category: CategoryType) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put<
        ApiResponseDataType<CategoryType>
      >("category/UpdateCategory", category);
      if (response.data.success) {
        dispatch(updateCategoryInState(response.data.data));
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

export const deleteCategory =
  (categoryId: number) =>
  async (dispatch: AppDispatch): Promise<ApiResponseType> => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete<ApiResponseType>(
        `category/DeleteCategory/${categoryId}`
      );
      if (response.data.success) {
        dispatch(deleteCategoryFromState(categoryId));
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

export const categoryReducer = categorySlice.reducer;
