import { createRoot } from "react-dom/client";
// styles
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";

createRoot(document.getElementById("root")).render(
  <ToastProvider>
    <App />
  </ToastProvider>
);