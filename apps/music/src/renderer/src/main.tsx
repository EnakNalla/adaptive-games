import "@ag/ui/src/styles.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppShell from "./components/AppShell";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppShell>
      <App />
    </AppShell>
  </React.StrictMode>
);
