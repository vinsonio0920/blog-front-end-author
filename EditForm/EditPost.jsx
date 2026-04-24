import { useContext } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { JwtContext } from "../src/jwt-context";
import styles from "./EditPost.module.css";

// we will have multiple sessionStorage data for each edited post!
const EditForm = () => {
  const jwt = useContext(JwtContext);
  const { result } = useLoaderData();

  if (!jwt.jwtToken) {
    return (
      <div className="errorContainer">
        <p className="errorPara">You are not currently signed in.</p>
        <Link to="/sign-in">Sign in now</Link>
      </div>
    );
  } else if (result.status === "error" && result.error === "forbidden") {
    return (
      <div className="errorContainer">
        <p className="errorPara">You are not allowed to edit this post.</p>
        <Link to="/">Go back to the homepage</Link>
      </div>
    );
  } else if (result.status === "error") {
    return (
      <div className="errorContainer">
        <p className="errorPara">
          There was an error loading the post. Please try again later.
        </p>
        <Link to="/sign-in">Go back to the homepage</Link>
      </div>
    );
  }
};

export { EditForm };
