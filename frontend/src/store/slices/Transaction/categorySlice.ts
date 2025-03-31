import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryType } from "../../../types/transaction/categoryType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";

interface CategoryState {
  category: CategoryType | null;
  messages: string[]; // messages are typically validation issues
  errors: string[]; // errors are typically server errors
  success: boolean;
  loading: boolean;
}

const initialState: CategoryState = {
  category: null,
  messages: [],
  errors: [],
  success: false,
  loading: false,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<CategoryType | null>) => {
      state.category = action.payload;
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

export const { setCategory, setMessages, setErrors, setSuccess, setLoading } =
  categorySlice.actions;

export const newCategory =
  (category: CategoryType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post(
        "category/NewCategory",
        category
      );
      const { data, messages, errors, success } = response.data;

      if (success) {
        dispatch(setCategory(data));
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

export const updateCategory =
  (category: CategoryType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put(
        "category/UpdateCategory",
        category
      );
      const { data, messages, errors, success } = response.data;

      if (success) {
        dispatch(setCategory(data));
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

export const deleteCategory =
  (category: CategoryType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete("category/DeleteCategory", {
        data: category,
      });
      const { messages, errors, success } = response.data;

      if (success) {
        dispatch(setCategory(null)); // Clear the category if deletion is successful
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

export const getCategory =
  (category: CategoryType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get("category/GetCategory", {
        params: category,
      });
      const { data, messages, errors, success } = response.data;

      if (success) {
        dispatch(setCategory(data));
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

export const getCategoryById =
  (categoryId: number) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get(
        `category/GetCategoryById/${categoryId}`
      );
      const { data, messages, errors, success } = response.data;

      if (success) {
        dispatch(setCategory(data));
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

export const categoryReducer = categorySlice.reducer;
