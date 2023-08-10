import React from "react";
import Login, { loginAction } from "./pages/auth/Login";
import Signup, { signupAction } from "./pages/auth/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ResetPassword from "./pages/auth/ResetPassword";
import ErrorBoundary from "./pages/errors/ErrorBoundary";
import Dashboard from "./pages/home/Dashboard";
import Contacts from "./pages/home/Contacts";
import Settings from "./pages/home/Settings";
import VerifyAccount, { verifyAccountAction } from "./pages/home/VerifyAccount";
import { Provider } from "react-redux";
import store from "./store";

const route = createBrowserRouter([
  {
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "/",
        element: <VerifyAccount />,
        action: verifyAccountAction,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "contacts",
            element: <Contacts />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
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
  return (
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  );
}

export default App;
