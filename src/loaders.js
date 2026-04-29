import { jwtDecode } from "jwt-decode";

const requireAuthor = async () => {
  const jwtToken = localStorage.getItem("jwtToken");

  if (jwtToken) {
    const decoded = jwtDecode(jwtToken);

    // get author from database and check status
    const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/users/${decoded.user.id}`;
    try {
      const response = await fetch(url);

      const result = await response.json();
      const user = result.data;

      if (user.type !== "author") {
        return {
          result: {
            status: "error",
            type: "authorization",
          },
        };
      } else {
        return {
          result: {
            status: "success",
          },
        };
      }
    } catch (err) {
      console.error(err.message);
    }
  } else {
    return;
  }
};

const dashboardLoader = async () => {
  const authorResult = await requireAuthor();
  if (authorResult?.result?.status === "error") {
    return authorResult;
  }

  // get user details
  const jwtToken = localStorage.getItem("jwtToken");

  if (jwtToken) {
    const decoded = jwtDecode(jwtToken);
    const userId = decoded.user.id;
    const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/posts?userId=${userId}&showUnpublished=true`;

    try {
      const response = await fetch(url);
      // no !response.ok conditional because our posts API always return JSON!

      const result = await response.json();
      return { result };
    } catch (err) {
      console.error(err.message);
      return {
        result: {
          status: "error",
          data: [],
        },
      };
    }
  } else {
    // returns the data needed to show not signed in in Dashboard
    return {
      result: {
        data: [],
      },
    };
  }
};

const createFormLoader = async () => {
  const authorResult = await requireAuthor();
  if (authorResult?.result?.status === "error") {
    return authorResult;
  }

  return {
    result: {
      status: "success",
    },
  };
};

const postLoader = async ({ params }) => {
  const authorResult = await requireAuthor();
  if (authorResult?.result?.status === "error") {
    return authorResult;
  }

  const jwtToken = localStorage.getItem("jwtToken");

  if (jwtToken) {
    const decoded = jwtDecode(jwtToken);
    const userId = decoded.user.id;
    const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/posts/${params.postId}?showUnpublished=true`;

    try {
      const response = await fetch(url);

      const result = await response.json();
      if (result.data.authorId === userId) {
        return { result };
      } else {
        return {
          result: {
            status: "error",
            error: "forbidden",
          },
        };
      }
    } catch (err) {
      console.error(err.message);
      return {
        result: {
          status: "error",
          data: [],
        },
      };
    }
    // Make sure that the post belongs to the user
  } else {
    return {
      result: {
        status: "error",
        error: {
          type: "auth",
          message: "You are not currently signed in.",
        },
      },
    };
  }
};

export { dashboardLoader, postLoader, createFormLoader };
