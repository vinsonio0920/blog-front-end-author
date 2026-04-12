import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.css";
import { logoSvg } from "../assets";

const ErrorPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.errorContainer}>
        <h1 className={styles.errorHeading}>Error 404</h1>
        <p>The page you are looking for doesn't exist.</p>
        <Link to="/" className={styles.homepageLink}>
          Go back to the homepage
        </Link>
        <div className={styles.logoContainer}>
          <img
            src={logoSvg}
            width="30"
            alt="Logo SVG"
            className={styles.logoSvg}
          />
          <span className={styles.logoText}>Vinson Studios</span>
        </div>
      </div>
    </div>
  );
};

export { ErrorPage };
