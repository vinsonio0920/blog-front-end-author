import { SignIn } from "./signIn/SignIn";
import { signInAction, signUpAction } from "./actions";
import { App } from "./App";
import { ErrorPage } from "./error/ErrorPage";
import { SignUp } from "./signUp/SignUp";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
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
