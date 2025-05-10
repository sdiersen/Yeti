import { AppDispatch } from "./store";
import { fetchAllCategories } from "./store/slices/Transaction/categorySlice";
import { fetchAllEntries } from "./store/slices/Transaction/entrySlice";
import { fetchAllItems } from "./store/slices/Transaction/ItemSlice";

export const initializeAppData = async (dispatch: AppDispatch) => {
  try {
    // This is where I will catch any errors loading the data. At the least they should be sent to console
    await dispatch(fetchAllCategories()); //TODO: Handle errors
    await dispatch(fetchAllItems()); //TODO: Handle errors
    await dispatch(fetchAllEntries()); //TODO: Handle errors
  } catch (error) {
    console.error("Error initializing app data:", error);
  }
};
