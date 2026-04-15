import { Link, useLoaderData } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useContext, useState } from "react";
import { JwtContext } from "../jwt-context";
import { format } from "date-fns";

const ConfirmationModal = ({
  targetedPost,
  setShowConfirmation,
  setTargetedPost,
}) => {
  // here if we cancel we should also setShowConfirmation and targetedPost
  // should this be a form or... just a fetch?

  // works for both cancel button and overlay
  const handleCancelClick = () => {
    setShowConfirmation(false);
    setTargetedPost(null);
  };

  return (
    <>
      <div className="overlay" onClick={handleCancelClick}></div>
      <div className={styles.confirmationModal}>
        <h1>Are you sure?</h1>
        <p>
          Do you want to {targetedPost.published ? "unpublish" : "publish"} this
          post?
        </p>
        <div className={styles.confirmationButtons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button type="button" className={styles.confirmButton}>
            {targetedPost.published ? "unpublish" : "publish"}
          </button>
        </div>
      </div>
    </>
  );
};

const Post = ({ post, setShowConfirmation, setTargetedPost }) => {
  const formattedDate = format(post.created, "MMM d, y");

  const handlePublishClick = () => {
    setShowConfirmation(true);
    setTargetedPost(post);
  };

  return (
    <article className={styles.postArticle}>
      <div className={styles.articleContent}>
        <Link to={`/posts/${post.id}`} className={styles.articleLink}></Link>
        <img
          src={post.image}
          width="300"
          className={styles.postImage}
          alt="Post image"
        />
        <Link to={`posts/${post.id}`} className={styles.postLink}>
          <h1 className={styles.postHeading}>{post.title}</h1>
        </Link>
        <p className={styles.postCreated}>{formattedDate}</p>
        <p>{post.description}</p>
        {post.categories.length >= 1 ? (
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
        ) : null}
      </div>
      <button
        type="button"
        className={`${styles.publishedButton} ${post.published ? styles.published : styles.notPublished}`}
        onClick={handlePublishClick}
      >
        {post.published ? "Published" : "Not Published"}
      </button>
    </article>
  );
};

const Dashboard = () => {
  const jwt = useContext(JwtContext);
  const [page, setPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [targetedPost, setTargetedPost] = useState(null);
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
      {targetedPost ? (
        <ConfirmationModal
          targetedPost={targetedPost}
          setShowConfirmation={setShowConfirmation}
          setTargetedPost={setTargetedPost}
        />
      ) : null}
      <div className={styles.dashboardContainer}>
        <h1 className={styles.mainHeading}>Dashboard</h1>
        <ul className={styles.postsUl}>
          {pagePosts.map((post) => (
            <li key={post.id}>
              <Post
                post={post}
                setShowConfirmation={setShowConfirmation}
                setTargetedPost={setTargetedPost}
              />
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
      </div>
    </>
  );
};

export { Dashboard };
