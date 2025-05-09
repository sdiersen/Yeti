import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getAllEntriesByItemId } from "../../store/slices/Transaction/entrySlice";
import { EntryType } from "../../types/transaction/entryType";
import "../../assets/css/shared/Colors.css";
import DraggableEntry from "./DraggableEntry";

interface EntryListByItemIdProps {
  itemId: number;
  onCalculateSpent: (sum: number) => void;
}

const EntryListByItemId: FC<EntryListByItemIdProps> = ({
  itemId,
  onCalculateSpent,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [entries, setEntries] = useState<EntryType[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const result = await dispatch(getAllEntriesByItemId(itemId));
        if (result.success) {
          console.log("Entries fetched successfully:", result.data);
          setEntries(result.data);
          const sum = result.data.reduce(
            (total, entry) => total + entry.amount,
            0
          );
          onCalculateSpent(sum);
        } else {
          for (const key in result.messages) {
            console.log(`${key}: ${result.messages[key]}`);
          }
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };
    fetchEntries();
  }, [dispatch, itemId]);
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
