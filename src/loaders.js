import { jwtDecode } from "jwt-decode";

const dashboardLoader = async () => {
  // get user details
  const jwtToken = localStorage.getItem("jwtToken");

  if (jwtToken) {
    const decoded = jwtDecode(jwtToken);
    const userId = decoded.user.id;
    const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/posts?userId=${userId}`;

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

const postLoader = async ({ params }) => {
  const jwtToken = localStorage.getItem("jwtToken");

  if (jwtToken) {
    const decoded = jwtDecode(jwtToken);
    const userId = decoded.user.id;
    const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/posts/${params.postId}`;

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

export { dashboardLoader, postLoader };
