import React from "react";
import Login, { loginAction } from "./pages/auth/Login";
import Signup, { signupAction } from "./pages/auth/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ResetPassword from "./pages/auth/ResetPassword";
import ErrorBoundary from "./pages/errors/ErrorBoundary";
// import { HomeLayout } from "./pages/home/HomeLayout";

const route = createBrowserRouter([
  {
    errorElement: <ErrorBoundary />,
    children: [
      // {
      //   path: "/",
      //   element: <HomeLayout />,
      // },
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "/signup",
        element: <Signup />,
        action: signupAction,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={route} />;
}

export default App;
