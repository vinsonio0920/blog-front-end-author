import { jwtDecode } from "jwt-decode";

const dashboardLoader = async () => {
  // get user details
  const jwtToken = localStorage.getItem("jwtToken");

  if (jwtToken) {
    const decoded = jwtDecode(jwtToken);
    const userId = decoded.user.id;
    const url = `http://localhost:3000/posts?userId=${userId}`;

    try {
      const response = await fetch(url);
      // no !response.ok conditional because our posts API always return JSON!

      const result = await response.json();
      return { result };
    } catch (err) {
      console.err(err.message);
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

export { dashboardLoader };
