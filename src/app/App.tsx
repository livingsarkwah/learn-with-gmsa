import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { router } from "./routes";
import { AppProvider } from "../lib/AppContext";
import { queryClient } from "../lib/queryClient";

export default function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors position="bottom-right" />
      </QueryClientProvider>
    </AppProvider>
  );
}
