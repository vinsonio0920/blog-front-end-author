import { Link, useFetcher } from "react-router-dom";
import styles from "./SignUp.module.css";
import { logoSvg, tripleT } from "../assets";

const ErrorElement = ({ message }) => {
  return <p className={styles.error}>{message}</p>;
};

const SignUp = () => {
  const fetcher = useFetcher();

  const formErrors = {};
  // make errors into key-value pairs for easier retrieval (if any)
  fetcher.data?.errors.map((error) => {
    formErrors[error.path] = error.msg;
  });

  return (
    <div className={styles.pageContainer}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <img
            src={logoSvg}
            width="30"
            alt="Logo SVG"
            className={styles.logoSvg}
          />
          <div className={styles.callToAction}>
            <h1>
              Share more with{" "}
              <span className={styles.logoText}>Vinson Studio</span>
            </h1>
            <p>
              "Tung, tung, tung, tung, tung, tung, tung, tung, tung, sahur."
              Anomali mengerikan yang hanya keluar pada sahur, konon katanya
              kalau ada orang yang dipanggil sahur tiga kali dan tidak nyaut,
              maka makhluk ini datang di rumah kalian.
              <img
                src={tripleT}
                className={styles.tripleT}
                width="30"
                alt="An image of tung tung tung sahur"
              />
              <img
                src={tripleT}
                className={styles.tripleT}
                width="30"
                alt="An image of tung tung tung sahur"
              />
              <img
                src={tripleT}
                className={styles.tripleT}
                width="30"
                alt="An image of tung tung tung sahur"
              />
            </p>
          </div>
        </div>
      </section>
      <section className={styles.formSection}>
        <div className={styles.formContent}>
          <Link to="/" className={styles.logoLink}>
            <img
              src={logoSvg}
              width="30"
              alt="Logo SVG"
              className={styles.logoSvg}
            />
            <span className={styles.logoText}>Vinson Studio</span>
          </Link>
          <fetcher.Form className={styles.authForm} method="POST">
            <h1>Create Account</h1>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={formErrors["name"] ? styles.invalid : null}
                required
                minLength="3"
                maxLength="64"
              />
              {formErrors["name"] && (
                <ErrorElement message={formErrors["name"]} />
              )}
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                className={formErrors["email"] ? styles.invalid : null}
                required
                minLength="3"
                maxLength="254"
              />
              {formErrors["email"] && (
                <ErrorElement message={formErrors["email"]} />
              )}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="text"
                id="password"
                name="password"
                className={formErrors["password"] ? styles.invalid : null}
                required
              />
              {formErrors["password"] && (
                <ErrorElement message={formErrors["password"]} />
              )}
            </div>
            <button type="submit">Sign up</button>
          </fetcher.Form>
          <p className={styles.redirectLink}>
            Already have an account? <Link to="/sign-in">Sign In</Link>
          </p>
        </div>
      </section>
    </div>
  );
};

export { SignUp };
