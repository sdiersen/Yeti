import { EntryType } from "../transaction/entryType";
import { DRAG_AND_DROP_TYPE } from "./dndConstants";

export interface DraggableEntryType extends EntryType {
  type: typeof DRAG_AND_DROP_TYPE;
}

export interface DraggableEntry {
  entry: EntryType;
}
