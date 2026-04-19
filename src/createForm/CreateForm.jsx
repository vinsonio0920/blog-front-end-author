import { useContext } from "react";
import { JwtContext } from "../jwt-context";
import styles from "./CreateForm.module.css";
import { Form, Link } from "react-router-dom";

const CreateForm = () => {
  const jwt = useContext(JwtContext);

  if (!jwt.jwtToken) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorPara}>You are not currently signed in.</p>
        <Link to="/sign-in">Sign in now</Link>
      </div>
    );
  }

  return (
    <Form method="PoST">
      <h1>Create New Post</h1>
      <section>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required maxLength="64" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            required
            maxLength="254"
          />
        </div>
        <div>
          <label htmlFor="image">Image Link</label>
          <input type="text" id="image" name="image" required />
        </div>
        <div>
          {/* this will have to be quite complex */}
          <label htmlFor="categorySearch">Categories</label>
          <input
            type="text"
            id="categorySearch"
            name="categorySearch"
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <input type="text" id="content" name="content" required />
        </div>
        <div className={styles.publishedInput}>
          <label htmlFor="published" className={styles.checkboxContainer}>
            Publish article?
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked
            />
            <span className={styles.checkmark}></span>
          </label>
        </div>
      </section>
      <section>
        <div className={styles.confirmationButtons}>
          <button type="button" className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.confirmButton}>
            Create
          </button>
        </div>
      </section>
    </Form>
  );
};

export { CreateForm };
