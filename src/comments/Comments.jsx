import { useEffect, useState } from "react";
import styles from "./Comments.module.css";
import { format } from "date-fns";

const CommentsList = ({ comments }) => {
  if (comments.status === "error" && comments.method === "get") {
    return (
      <p className={styles.commentsErrorPara}>
        There was an error fetching the comments. Please try again later.
      </p>
    );
  } else if (comments.length < 1) {
    return <p>No comments yet. Start the discussion!</p>;
  }

  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id} className={styles.commentLi}>
          <header>
            <p className={styles.commentName}>{comment.name}</p>
            <p className={styles.commentDate}>
              {format(comment.created, "MMMM d y, ")} at{" "}
              {format(comment.created, "h:mm a")}
            </p>
          </header>
          <p className={styles.commentContent}>{comment.content}</p>
        </li>
      ))}
    </ul>
  );
};

const Comments = ({ postId }) => {
  // update comments on delete!
  const [commentsCount, setCommentsCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [cursor, setCursor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/posts/${postId}/comments`;

      try {
        const response = await fetch(url);

        const result = await response.json();
        if (result.status === "success") {
          if (result.data.comments.length <= 0) return;

          const lastPost =
            result.data.comments[result.data.comments.length - 1];
          setCursor(lastPost.id);

          setCommentsCount(result.data.commentsCount);
          return setComments(result.data.comments);
        } else {
          return setComments({
            status: "error",
            method: "get",
          });
        }
      } catch (err) {
        console.error(err.message);
        return setComments({
          status: "error",
          method: "get",
        });
      }
    };

    fetchData();
  }, [postId]);

  const handleCommentLoadClick = async () => {
    const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/posts/${postId}/comments?cursor=${cursor}`;

    if (comments.length >= commentsCount) return;

    try {
      const response = await fetch(url);

      const result = await response.json();
      if (result.status === "success") {
        const lastPost = result.data.comments[result.data.comments.length - 1];
        setCursor(lastPost.id);

        setCommentsCount(result.data.commentsCount);

        const newComments = comments.concat(result.data.comments);
        return setComments(newComments);
      } else {
        return setCursor({
          status: "error",
          method: "load",
        });
      }
    } catch (err) {
      console.error(err.message);
      return setCursor({
        status: "error",
        method: "load",
      });
    }
  };

  return (
    <div className={styles.commentsContainer}>
      <h1 className={styles.title}>Comments</h1>
      <CommentsList comments={comments} />
      {cursor?.status === "error" && (
        <p className={styles.commentsLoadErrorPara}>
          There was an error loading the comments. Please try again later.
        </p>
      )}
      {comments.length >= commentsCount && comments.length > 0 && (
        <p className={styles.commentEndPara}>End of comments.</p>
      )}
      {comments.length < commentsCount && comments.length > 0 && (
        <button
          type="button"
          onClick={handleCommentLoadClick}
          className={styles.loadButton}
        >
          Load more comments
        </button>
      )}
    </div>
  );
};

export { Comments };
