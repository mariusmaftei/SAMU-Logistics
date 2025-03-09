import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/layout/root-layout/RootLayout";
import Home from "./pages/home/home";
import Inventory from "./pages/inventory/inventory";
import FormData from "./pages/form-data/form-data";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/form",
          element: <Home />,
        },
        {
          path: "/entries",
          element: <FormData />,
        },
        {
          path: "/inventory",
          element: <Inventory />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
