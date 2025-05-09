import { AppDispatch } from "./src/store";
import { fetchAllCategories } from "./src/store/slices/Transaction/categorySlice";

export const initializeAppData = async (dispatch: AppDispatch) => {
  try {
    await dispatch(fetchAllCategories()); //TODO: Handle errors
  } catch (error) {
    console.error("Error initializing app data:", error);
  }
};
