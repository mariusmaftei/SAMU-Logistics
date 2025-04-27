import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/layout/root-layout/RootLayout";
import Form from "./pages/form/form";
import FormEntries from "./pages/form-entries/form-entries";
import Home from "./pages/home/home";
import {ZoomProvider} from "./context/ZoomContext"

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/form",
          element: <Form />,
        },
        {
          path: "/entries",
          element: <FormEntries />,
        },
      ],
    },
  ]);

  return (
    <ZoomProvider>
      <RouterProvider router={router} />
    </ZoomProvider>
  )
}
