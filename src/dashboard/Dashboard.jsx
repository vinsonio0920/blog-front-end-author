import { Link, useLoaderData } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useContext, useState } from "react";
import { JwtContext } from "../jwt-context";

const Post = ({ post }) => {
  return (
    <article className={styles.postArticle}>
      <img src={post.image} width="300" alt="Post image" />
      <h2>{post.title}</h2>
      <p>{post.created}</p>
      <p>{post.description}</p>
      <div className={styles.categoriesContainer}>
        {post.categories.map((category) => (
          <Link
            to={`/categories/${category.id}`}
            className={styles.categoryLink}
            key={category.id}
          >
            {category.name}
          </Link>
        ))}
      </div>
      <button type="button">
        {post.published ? "Published" : "Not Published"}
      </button>
    </article>
  );
};

const Dashboard = () => {
  const jwt = useContext(JwtContext);
  const [page, setPage] = useState(1);
  const { result } = useLoaderData();

  const posts = result.data;
  const maxPages = Math.floor(posts.length / 8) + 1;
  let pagePosts;
  if (posts.length > 8) {
    pagePosts = posts.slice((page - 1) * 8, (page - 1) * 8 + 8);
  } else {
    pagePosts = posts;
  }

  function handlePageButtonClick(event) {
    const buttonType = event.currentTarget.dataset.type;

    if (buttonType === "previous") {
      if (page <= 1) return;

      setPage(page - 1);
    } else {
      if (page >= maxPages) return;

      setPage(page + 1);
    }
  }

  if (!jwt.jwtToken) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorPara}>You are not currently signed in.</p>
        <Link to="/sign-in">Sign in now</Link>
      </div>
    );
  } else if (posts.length <= 0) {
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
      <h1 className={styles.mainHeading}>Dashboard</h1>
      <ul className={styles.postUl}>
        {pagePosts.map((post) => (
          <li key={post.id}>
            <Post post={post} />
          </li>
        ))}
      </ul>
      <div className={styles.pageContainer}>
        <button
          className={page <= 1 ? styles.disabled : ""}
          aria-label="Previous page"
          data-type="previous"
          onClick={handlePageButtonClick}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <p>Page {page}</p>
        <button
          className={page >= maxPages ? styles.disabled : ""}
          aria-label="Next page"
          data-type="next"
          onClick={handlePageButtonClick}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </>
  );
};

export { Dashboard };
