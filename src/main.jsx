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
        colors: {
          blue: [
            '#E7F5FF',
            '#D0EBFF',
            '#A5D8FF',
            '#74C0FC',
            '#339AF0',
            '#228BE6',
            '#1C7ED6',
            '#1971C2',
            '#1864AB',
            '#F5F5DC', // Our main bone white color
          ],
          playerBlue: [
            '#e6f7ff',
            '#b3ebff',
            '#80dfff',
            '#4dd3ff',
            '#1ac7ff',
            '#04cbee',
            '#03a8c7',
            '#0285a0',
            '#016279',
            '#003f52'
          ],
          playerRed: [
            '#ffe6e6',
            '#ffb3b3',
            '#ff8080',
            '#ff4d4d',
            '#ff1a1a',
            '#fc3f31',
            '#d9362a',
            '#b62d23',
            '#93241c',
            '#701b15'
          ]
        },
        primaryColor: 'blue',
        primaryShade: 9,
        other: {
          primaryColor: '#F5F5DC',
        },
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
