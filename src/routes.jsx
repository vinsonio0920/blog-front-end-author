import { App } from "./App";
import { ErrorPage } from "./error/ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
];

export { routes };
