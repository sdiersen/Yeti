import { FC } from "react";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "./store";
import AppRoutes from "./AppRoutes";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { EntryType } from "./types/transaction/entryType";
import { DroppableEntryTarget } from "./types/dnd/droppableTypes";
import { updateEntry } from "./store/slices/Transaction/entrySlice";

const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      return;
    }
    const draggedEntry = active.data.current as EntryType;
    console.log("Dragged entry:", draggedEntry.entry);
    const dropTarget = over.data.current as DroppableEntryTarget;
    if (
      draggedEntry.categoryId === dropTarget.categoryId &&
      draggedEntry.itemId === dropTarget.itemId
    ) {
      // The dragged entry and the drop target are the same, so we don't need to do anything.
      return;
    }
    const updatedEntry: EntryType = {
      ...draggedEntry.entry,
      categoryId: dropTarget.categoryId,
      itemId: dropTarget.itemId,
    };
    console.log("Updated entry:", updatedEntry);
    try {
      const result = await dispatch(updateEntry(updatedEntry));
      if (result.success) {
        // Handle success, e.g., show a success message or update the UI
        console.log("Entry successfully moved:");
      } else {
        for (const key in result.messages) {
          console.log(`${key}: ${result.messages[key]}`);
        }
        for (const key in result.errors) {
          console.log(`${key}: ${result.errors[key]}`);
        }
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("An unexpected error occurred while updating the item.");
    }
  };

  return (
    <Provider store={store}>
      <DndContext onDragEnd={handleDragEnd}>
        <AppRoutes />
      </DndContext>
    </Provider>
  );
};

export default App;
