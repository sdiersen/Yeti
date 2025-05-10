import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "../../assets/css/shared/Colors.css";
import DraggableEntry from "./DraggableEntry";

interface EntryListByItemIdProps {
  itemId: number;
}

const EntryListByItemId: FC<EntryListByItemIdProps> = ({ itemId }) => {
  const entries = useSelector((state: RootState) => state.entry.entries).filter(
    (entry) => entry.itemId === itemId
  );

  return (
    <>
      <table className="mt-0 pt-0" style={{ width: "100%" }}>
        <tbody>
          {entries && entries.map((entry) => <DraggableEntry entry={entry} />)}
        </tbody>
      </table>
    </>
  );
};
export default EntryListByItemId;
