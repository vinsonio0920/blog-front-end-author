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
          <label htmlFor="categorySearc">Categories</label>
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
        <div htmlFor="published">
          <label htmlFor="">Publish article?</label>
          <input type="checkbox" id="published" name="published" checked />
        </div>
      </section>
      <section>
        <button type="button">Cancel</button>
        <button type="submit">Create</button>
      </section>
    </Form>
  );
};

export { CreateForm };
