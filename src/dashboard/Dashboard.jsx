import { Link, useFetcher, useLoaderData } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useContext, useEffect, useState } from "react";
import { JwtContext } from "../jwt-context";
import { format } from "date-fns";

const ConfirmationModal = ({
  targetedPost,
  setTargetedPost,
  actionType,
  setActionType,
}) => {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.status === "success") {
      // hide modal and reset targetedPost and actiontype
      setTargetedPost(null);
      setActionType(null);
    }
  }, [fetcher, setTargetedPost, setActionType]);

  const handleCancelClick = () => {
    setTargetedPost(null);
  };

  let confirmationText = null;
  let submitText = null;

  if (actionType === "publish") {
    confirmationText = `
        Do you want to ${targetedPost.published ? "unpublish" : "publish"} this
        post?`;

    submitText = targetedPost.published ? "unpublish" : "publish";
  } else {
    confirmationText = "Do you want to delete this post?";

    submitText = "delete";
  }

  return (
    <>
      <div className="overlay" onClick={handleCancelClick}></div>
      <fetcher.Form method="POST" className={styles.confirmationModal}>
        <h1>Are you sure?</h1>
        <p>{confirmationText}</p>
        {fetcher.data?.status === "error" ? (
          <p className={styles.error}>
            An error occurred{" "}
            {actionType === "publish" ? "updating" : "deleting"} the post.
            Please try again later.
          </p>
        ) : null}
        <div className={styles.confirmationButtons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button type="submit" className={styles.confirmButton}>
            {submitText}
          </button>
        </div>
        <input
          type="hidden"
          id="post"
          name="post"
          value={JSON.stringify(targetedPost)}
        />
        <input type="hidden" id="action" name="action" value={actionType} />
      </fetcher.Form>
    </>
  );
};

const Post = ({ post, setTargetedPost, setActionType }) => {
  const formattedDate = format(post.created, "MMM d, y");

  const handleDeleteClick = () => {
    setTargetedPost(post);
    setActionType("delete");
  };

  const handlePublishClick = () => {
    setTargetedPost(post);
    setActionType("publish");
  };

  return (
    <article className={styles.postArticle}>
      <div className={styles.articleContent}>
        <button
          type="button"
          className={styles.deleteButton}
          aria-label="delete"
          onClick={handleDeleteClick}
        >
          <span className="material-symbols-outlined">delete</span>
        </button>

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
  const [targetedPost, setTargetedPost] = useState(null);
  const [actionType, setActionType] = useState(null);
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
      <div className="errorContainer">
        <p className="errorPara">You are not currently signed in.</p>
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
          setTargetedPost={setTargetedPost}
          actionType={actionType}
          setActionType={setActionType}
        />
      ) : null}
      <div className={styles.dashboardContainer}>
        <h1 className={styles.mainHeading}>Dashboard</h1>
        <ul className={styles.postsUl}>
          {pagePosts.map((post) => (
            <li key={post.id}>
              <Post
                post={post}
                setTargetedPost={setTargetedPost}
                setActionType={setActionType}
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
