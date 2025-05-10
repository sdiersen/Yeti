import { DragEndEvent } from "@dnd-kit/core";
import { AppDispatch } from "../store";
import { DRAG_AND_DROP_TYPE } from "./dndConstants";
import { entryDragHandler } from "./dragHandlers/entryDragHandler";

export type DragHandler = (
  event: DragEndEvent,
  dispatch: AppDispatch
) => Promise<void>;

const dragHandlers: Record<string, DragHandler> = {
  [DRAG_AND_DROP_TYPE.ENTRY]: entryDragHandler,
  // Add other handlers here as needed
};

export const handleDragEnd = async (
  event: DragEndEvent,
  dispatch: AppDispatch
) => {
  const { active } = event;
  const type = active.data.current?.type as string;

  if (type && dragHandlers[type]) {
    await dragHandlers[type](event, dispatch);
  } else {
    console.error("No drag handler found for type:", type);
  }
};
