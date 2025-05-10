import { FC } from "react";
import { Provider, useDispatch } from "react-redux";
import { AppDispatch, store } from "./store";
import AppRoutes from "./AppRoutes";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { handleDragEnd } from "./dnd/dragHandlersIndex";

const App: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Provider store={store}>
      <DndContext
        onDragEnd={(event: DragEndEvent) => handleDragEnd(event, dispatch)}>
        <AppRoutes />
      </DndContext>
    </Provider>
  );
};

export default App;
