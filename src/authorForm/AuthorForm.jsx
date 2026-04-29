import styles from "./AuthorForm.module.css";

const AuthorForm = () => {
  return (
    <form className={styles.authorForm}>
      <h1 className={styles.authorHeading}>Become an Author</h1>
      <p className={styles.authorPara}>
        To become an author, enter the secret code!
      </p>
      <div>
        <label htmlFor="code" className="visuallyHidden">
          Code
        </label>
        <input type="text" id="code" name="code" required maxLength="64" />
      </div>
      <button type="submit" className={styles.submitButton}>
        Verify
      </button>
    </form>
  );
};

export { AuthorForm };
