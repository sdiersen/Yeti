// filepath: src/components/ExampleComponent.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { increment, decrement } from "../redux/slices/exampleSlice";
import Button from "@mui/material/Button";

const ExampleComponent: React.FC = () => {
  const dispatch = useDispatch();
  const value = useSelector((state: RootState) => state.example.value);

  return (
    <div>
      <h1>{value}</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => dispatch(increment())}
      >
        Increment
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </Button>
    </div>
  );
};

export default ExampleComponent;
