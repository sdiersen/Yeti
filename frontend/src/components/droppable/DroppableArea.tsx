import { useDroppable } from "@dnd-kit/core";
import { FC } from "react";

interface DroppableAreaProps {
  id: string;
  categoryId: number;
  itemId: number;
  children: React.ReactNode;
}

const DroppableArea: FC<DroppableAreaProps> = ({
  id,
  categoryId,
  itemId,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { categoryId, itemId },
  });

  const style = {
    padding: "16px",
    margin: "8px",
    backgroundColor: isOver ? "#d4edda" : "#f8f9fa",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default DroppableArea;
