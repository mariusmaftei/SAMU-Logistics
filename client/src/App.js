import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/home/home";

import AuthPage from "./pages/auth/AuthPage";
import RootLayout from "./components/RootLayout/RootLayout";
import FormEntriesPage from "./pages/form-entries/FormEntriesPage";
import SubmitFormPage from "./pages/submit-form/SubmitFormPage";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import UnauthorizedPage from "./pages/unauthorized/UnauthorizedPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <AuthPage />,
    },
    {
      path: "/unauthorized",
      element: <UnauthorizedPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <RootLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/samu-logistics",
          element: <Home />,
        },
        {
          path: "/form",
          element: <SubmitFormPage />,
        },
        {
          path: "/entries",
          element: <FormEntriesPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
