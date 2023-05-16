import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";
import { ApolloProvider } from "@apollo/client";
import { SnackbarProvider } from "notistack";
// import ThemeConfig from "./theme/theme";

import client from "./utils/GqlClient";
import { ThemedApp } from "./theme-utils";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      {/* <ThemeConfig> */}
      <ThemedApp>
        <SnackbarProvider maxSnack={5}>
          <ApolloProvider client={client}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ApolloProvider>
        </SnackbarProvider>
      </ThemedApp>
      {/* </ThemeConfig> */}
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
