import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CharacterAnimationsProvider } from "./contexts/CharacterAnimations";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        fontFamily: '"Exo 2", sans-serif',
        headings: { fontFamily: '"Exo 2", sans-serif' },
        globalStyles: (_theme) => ({
          body: {
            width: "100vw",
            height: "100vh",
            fontFamily: '"Exo 2", sans-serif',
          },
          "#root": {
            width: "100%",
            height: "100%",
          },
          // Ensure all buttons use Exo 2 font with proper settings
          ".mantine-Button-root": {
            fontFamily: '"Exo 2", sans-serif',
            fontOpticalSizing: 'auto',
            fontStyle: 'normal',
          },
          // Also target any button elements
          "button": {
            fontFamily: '"Exo 2", sans-serif',
            fontOpticalSizing: 'auto',
            fontStyle: 'normal',
          },
        }),
      }}
    >
      <CharacterAnimationsProvider>
        <App />
      </CharacterAnimationsProvider>
    </MantineProvider>
  </React.StrictMode>
);
