import { SignIn } from "./signIn/SignIn";
import {
  createFormAction,
  dashboardAction,
  signInAction,
  signUpAction,
} from "./actions";
import { App } from "./App";
import { ErrorPage } from "./error/ErrorPage";
import { SignUp } from "./signUp/SignUp";
import { Dashboard } from "./dashboard/Dashboard";
import { dashboardLoader } from "./loaders";
import { CreateForm } from "./createForm/CreateForm";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        action: dashboardAction,
        element: <Dashboard />,
        loader: dashboardLoader,
      },
      {
        path: "/create",
        action: createFormAction,
        element: <CreateForm />,
      },
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
