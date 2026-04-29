import { useFetcher } from "react-router-dom";
import styles from "./AuthorForm.module.css";
import { useContext } from "react";
import { JwtContext } from "../jwt-context";
import { jwtDecode } from "jwt-decode";

const AuthorForm = () => {
  const fetcher = useFetcher();
  const jwt = useContext(JwtContext);

  const user = jwtDecode(jwt.jwtToken).user;
  const formErrors = {};
  // make errors into key-value pairs for easier retrieval (if any)
  fetcher.data?.errors.map((error) => {
    formErrors[error.path] = error.msg;
  });

  return (
    <fetcher.Form
      method="POST"
      className={styles.authorForm}
      autoComplete="off"
    >
      <h1 className={styles.authorHeading}>Become an Author</h1>
      <p className={styles.authorPara}>
        To become an author, enter the secret code!
      </p>
      <section>
        <div>
          <label htmlFor="code" className="visuallyHidden">
            Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            required
            maxLength="64"
            className={formErrors["code"] && styles.invalid}
          />
          {formErrors["code"] && (
            <p className={styles.error}>{formErrors["code"]}</p>
          )}
        </div>
        <div>
          <input type="hidden" id="type" name="type" value="author" />
        </div>
        <div>
          <input type="hidden" id="userId" name="userId" value={user.id} />
        </div>
      </section>
      <section>
        <button type="submit" className={styles.submitButton}>
          Verify
        </button>
      </section>
    </fetcher.Form>
  );
};

export { AuthorForm };
