import { SignIn } from "./signIn/SignIn";
import {
  createFormAction,
  dashboardAction,
  editFormAction,
  signInAction,
  signUpAction,
} from "./actions";
import { App } from "./App";
import { ErrorPage } from "./error/ErrorPage";
import { SignUp } from "./signUp/SignUp";
import { Dashboard } from "./dashboard/Dashboard";
import { dashboardLoader, postLoader } from "./loaders";
import { CreateForm } from "./createForm/CreateForm";
import { EditForm } from "./editForm/EditPost";
import { About } from "./about/About";

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
      {
        path: "/posts/:postId",
        action: editFormAction,
        element: <EditForm />,
        loader: postLoader,
      },
      {
        path: "/about",
        element: <About />,
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
