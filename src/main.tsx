import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./components/ErrorBoundary";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);

// Defer decorative body background (6% opacity overlay) until after FCP
if (typeof window !== "undefined") {
  const loadBg = () => {
    const img = new Image();
    img.src = "/luxury-beauty-background.webp";
    img.onload = () => document.body.classList.add("bg-loaded");
  };
  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(loadBg);
  } else {
    setTimeout(loadBg, 2000);
  }
}
