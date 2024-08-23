import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";

import { QueryProvider } from "./providers/query-provider.tsx";
import { NetworkStoreProvider } from "./providers/network-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <NetworkStoreProvider>
      <App />
    </NetworkStoreProvider>
  </QueryProvider>
);
