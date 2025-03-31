// filepath: src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { accountReducer } from "./slices/Identity/accountSlice";
import { roleReducer } from "./slices/Identity/roleSlice";
import { userDataReducer } from "./slices/Identity/userDataSlice";
import { categoryReducer } from "./slices/Transaction/categorySlice";
import { accountRoleReducer } from "./slices/Identity/accountRoleSlce";
import { categoryItemReducer } from "./slices/Transaction/categoryItemSlice";
import { entryReducer } from "./slices/Transaction/entrySlice";
import { itemReducer } from "./slices/Transaction/ItemSlice";

export const store = configureStore({
  reducer: {
    // Identity slices
    account: accountReducer,
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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
