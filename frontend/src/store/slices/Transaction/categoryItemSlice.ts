import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryItemType } from "../../../types/transaction/categoryItemType";
import axiosInstance, { handleAxiosError } from "../../../api/axios";

interface CategoryItemState {
  categoryItem: CategoryItemType | null;
  messages: string[]; // messages are typically validation issues
  errors: string[]; // errors are typically server errors
  success: boolean;
  loading: boolean;
}

const initialState: CategoryItemState = {
  categoryItem: null,
  messages: [],
  errors: [],
  success: false,
  loading: false,
};

const categoryItemSlice = createSlice({
  name: "categoryItem",
  initialState,
  reducers: {
    setCategoryItem: (
      state,
      action: PayloadAction<CategoryItemType | null>
    ) => {
      state.categoryItem = action.payload;
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

export const {
  setCategoryItem,
  setMessages,
  setErrors,
  setSuccess,
  setLoading,
} = categoryItemSlice.actions;

export const newCategoryItem =
  (categoryItem: CategoryItemType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post(
        "categoryItem/NewCategoryItem",
        categoryItem
      );
      const { data, messages, errors, success } = response.data;

      if (success) {
        dispatch(setCategoryItem(data));
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

export const updateCategoryItem =
  (categoryItem: CategoryItemType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.put(
        "categoryItem/UpdateCategoryItem",
        categoryItem
      );
      const { data, messages, errors, success } = response.data;

      if (success) {
        dispatch(setCategoryItem(data));
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

export const deleteCategoryItem =
  (categoryItem: CategoryItemType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.delete(
        "categoryItem/DeleteCategoryItem",
        { data: categoryItem }
      );
      const { messages, errors, success } = response.data;

      dispatch(setMessages(messages || []));
      dispatch(setErrors(errors || []));
      dispatch(setSuccess(success));
    } catch (error) {
      handleAxiosError(error, dispatch, setErrors, setMessages, setSuccess);
    } finally {
      dispatch(setLoading(false));
    }
  };

export const getCategoryItem =
  (categoryItem: CategoryItemType) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get("categoryItem/GetCategoryItem", {
        params: categoryItem,
      });
      const { data, messages, errors, success } = response.data;

      if (success) {
        dispatch(setCategoryItem(data));
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

export const getCategoryItemById =
  (categoryItemId: number) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.get(
        `categoryItem/GetCategoryItems/${categoryItemId}`
      );
      const { data, messages, errors, success } = response.data;

      if (success) {
        dispatch(setCategoryItem(data));
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

export const categoryItemReducer = categoryItemSlice.reducer;
