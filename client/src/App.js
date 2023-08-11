import React from "react";
import Login, { loginAction } from "./pages/auth/Login";
import Signup, { signupAction } from "./pages/auth/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ResetPassword, { resetPasswordAction } from "./pages/auth/ResetPassword";
import ActionErrorBoundary from "./pages/errors/ActionErrorBoundary";
import Dashboard, { dashboardActions } from "./pages/home/Dashboard";
import Contacts from "./pages/home/Contacts";
import Settings from "./pages/home/Settings";
import VerifyAccount, { verifyAccountAction } from "./pages/home/VerifyAccount";
import { Provider } from "react-redux";
import store from "./store";
import Room from "./pages/home/Room";
import SocketProvider from "./context/SocketProvider";

const router = createBrowserRouter([
  {
    errorElement: <ActionErrorBoundary />,
    children: [
      {
        path: "/",
        element: <VerifyAccount />,
        action: verifyAccountAction,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
            action: dashboardActions,
          },
          {
            path: "contacts",
            element: <Contacts />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "room/:id",
            element: <Room />,
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
        action: resetPasswordAction,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </Provider>
  );
}

export default App;
