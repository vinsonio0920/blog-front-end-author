import { format } from "date-fns";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import styles from "./Preview.module.css";
import { jwtDecode } from "jwt-decode";

const Preview = ({ formData }) => {
  const jwtToken = localStorage.getItem("jwtToken");
  const decoded = jwtDecode(jwtToken);

  const { title, image, content, description, categoryObjects } = formData;
  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMM d, y");
  const author = decoded.user.name;

  return (
    <section className={styles.preview}>
      <header>
        <p className={styles.date}>{formattedDate}</p>
      </header>
      <h1 className={styles.title}>{title || "[Your Title Here]"}</h1>
      <img
        src={
          image ||
          "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?_=20210521171500"
        }
        alt="Article image"
        className={styles.image}
      />
      <p className={styles.author}>Posted by {author}. No comments yet.</p>
      <p className={styles.description}>{description}</p>
      <ul className={styles.categoriesContainer}>
        {categoryObjects.map((category) => (
          <li key={category.id} className={styles.categoryLink}>
            {category.name}
          </li>
        ))}
      </ul>
      <div className={styles.content}>
        {content ? (
          parse(DOMPurify.sanitize(content))
        ) : (
          <p>Write your thoughts here!</p>
        )}
      </div>
      <div>
        <h2 className={styles.commentsHeading}>Comments</h2>
        <p>No comments yet. Start the discussion!</p>
      </div>
    </section>
  );
};

export { Preview };
