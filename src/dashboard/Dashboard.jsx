import { Link, useLoaderData } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useContext } from "react";
import { JwtContext } from "../jwt-context";

const Dashboard = () => {
  const jwt = useContext(JwtContext);
  const { result } = useLoaderData();
  console.log(result);

  const post = result.data;

  if (!jwt.jwtToken) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorPara}>You are not currently signed in.</p>
        <Link to="/sign-in">Sign in now</Link>
      </div>
    );
  } else if (post.length <= 0) {
    return (
      <div className={styles.emptyContainer}>
        <h1 className={styles.mainHeading}>Dashboard</h1>
        <div className={styles.emptyDiv}>
          <p>No posts created yet!</p>
          <Link to="/create">Create a post</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1>Dashboard</h1>
    </>
  );
};

export { Dashboard };
