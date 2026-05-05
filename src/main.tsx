import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/Routes.tsx";
import ReduxProviderWrapper from "./redux/readux-provider/reduxProviderWrapper.tsx";
import { DashboardToaster } from "./components/ui/Toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <ReduxProviderWrapper>
        <RouterProvider router={routes} />
        <DashboardToaster />
      </ReduxProviderWrapper>
  </StrictMode>
);
