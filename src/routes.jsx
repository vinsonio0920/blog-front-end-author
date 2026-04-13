import { SignIn } from "./signIn/SignIn";
import { signInAction, signUpAction } from "./actions";
import { App } from "./App";
import { ErrorPage } from "./error/ErrorPage";
import { SignUp } from "./signUp/SignUp";
import { Dashboard } from "./dashboard/Dashboard";
import { dashboardLoader } from "./loaders";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard />, loader: dashboardLoader },
    ],
  },
  {
    path: "/sign-up",
    action: signUpAction,
    element: <SignUp />,
  },
  {
    path: "/sign-in",
    action: signInAction,
    element: <SignIn />,
  },
];

export { routes };
