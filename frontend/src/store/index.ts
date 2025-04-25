// filepath: src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { accountReducer } from "./slices/Identity/accountSlice";
import { roleReducer } from "./slices/Identity/roleSlice";
import { userDataReducer } from "./slices/Identity/userDataSlice";
import { categoryReducer } from "./slices/Transaction/categorySlice";
import { accountRoleReducer } from "./slices/Identity/accountRoleSlice";
import { categoryItemReducer } from "./slices/Transaction/categoryItemSlice";
import { entryReducer } from "./slices/Transaction/entrySlice";
import { itemReducer } from "./slices/Transaction/ItemSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAccountReducer = persistReducer(persistConfig, accountReducer);

export const store = configureStore({
  reducer: {
    // Identity slices
    account: persistedAccountReducer,
    accountRole: accountRoleReducer,
    role: roleReducer,
    userData: userDataReducer,

    // Transaction slices
    category: categoryReducer,
    categoryItem: categoryItemReducer,
    entry: entryReducer,
    item: itemReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
