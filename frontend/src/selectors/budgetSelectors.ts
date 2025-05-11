import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectAllItems = (state: RootState) => state.item.items;
export const selectAllEntries = (state: RootState) => state.entry.entries;

export const selectCategoryBudgets = createSelector(selectAllItems, (items) => {
  const sums: Record<number, { budget: number; spent: number }> = {};
  items.forEach((item) => {
    if (!sums[item.categoryId]) {
      sums[item.categoryId] = { budget: 0, spent: 0 };
    }
    sums[item.categoryId].budget += item.budgetAmount;
  });
  return sums;
});

export const selectItemSums = createSelector(selectAllEntries, (entries) => {
  const sums: Record<number, { amount: number }> = {};
  entries.forEach((entry) => {
    if (!sums[entry.itemId]) {
      sums[entry.itemId] = { amount: 0 };
    }
    sums[entry.itemId].amount += entry.amount;
  });
  return sums;
});

export const selectBudgetSums = createSelector(
  [selectAllItems, selectAllEntries],
  (items, entries) => {
    const categorySums: Record<number, { budget: number; spent: number }> = {};

    items.forEach((item) => {
      if (!categorySums[item.categoryId]) {
        categorySums[item.categoryId] = { budget: 0, spent: 0 };
      }
      categorySums[item.categoryId].budget += item.budgetAmount;
    });

    entries.forEach((entry) => {
      const item = items.find((item) => item.id === entry.itemId);
      if (item) {
        if (!categorySums[item.categoryId]) {
          categorySums[item.categoryId] = { budget: 0, spent: 0 };
        }
        categorySums[item.categoryId].spent += entry.amount;
      }
    });
    return categorySums;
  }
);

export const selectItemEntrySums = createSelector(
  selectAllEntries,
  (entries) => {
    const sums: Record<number, number> = {};
    entries.forEach((entry) => {
      if (!sums[entry.itemId]) {
        sums[entry.itemId] = 0;
      }
      sums[entry.itemId] += entry.amount;
    });
    return sums;
  }
);
