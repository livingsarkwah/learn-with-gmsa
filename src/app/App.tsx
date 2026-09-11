import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { AppProvider } from "../lib/AppContext";

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="bottom-right" />
    </AppProvider>
  );
}
