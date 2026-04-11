import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GeneratePassword from "./pages/GeneratePassword";
import EntryDetail from "./pages/EntryDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/generate",
    Component: GeneratePassword,
  },
  {
    path: "/entry/:id",
    Component: EntryDetail,
  },
]);
