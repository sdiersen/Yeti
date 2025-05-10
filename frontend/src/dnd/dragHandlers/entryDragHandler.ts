import { DraggableEntry } from "../draggableTypes";
import { DroppableEntryTarget } from "../droppableTypes";
import { updateEntry } from "../../store/slices/Transaction/entrySlice";
import { DragHandler } from "../dragHandlersIndex";

export const entryDragHandler: DragHandler = async (event, dispatch) => {
  const { active, over } = event;

  if (!over) {
    return;
  }

  const draggedEntry = (active.data.current as DraggableEntry).entry;
  const dropTarget = over.data.current as DroppableEntryTarget;

  if (
    draggedEntry.categoryId === dropTarget.categoryId &&
    draggedEntry.itemId === dropTarget.itemId
  ) {
    return;
  }

  const updatedEntry = {
    ...draggedEntry,
    categoryId: dropTarget.categoryId,
    itemId: dropTarget.itemId,
  };

  try {
    const result = await dispatch(updateEntry(updatedEntry));
    if (result.success) {
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
