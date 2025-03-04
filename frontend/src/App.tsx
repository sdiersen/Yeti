// filepath: src/App.tsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import ExampleComponent from "./components/ExampleComponent";
import theme from "./styles/theme";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <ExampleComponent />
    </ThemeProvider>
  );
};

export default App;
