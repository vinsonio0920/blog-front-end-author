import { redirect } from "react-router-dom";

const signUpAction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/sign-up`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: new URLSearchParams(formData),
    });

    const result = await response.json();

    if (result.status === "success") {
      // automatically sign in user for convenience
      const signInUrl = `${import.meta.env.VITE_BLOG_API_WEBSITE}/sign-in`;

      const response = await fetch(signInUrl, {
        method: "POST",
        body: new URLSearchParams({
          email: formData.email,
          password: formData.password,
        }),
      });

      const signInResult = await response.json();

      if (signInResult.status === "success") {
        const token = signInResult.data.token;
        localStorage.setItem("jwtToken", token);

        return redirect("/");
      } else {
        // sign in failed, so users will have to do it manually
        return redirect("/sign-in");
      }
    } else {
      return result;
    }
  } catch (err) {
    console.error(err.messsage);
  }
};

const signInAction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/sign-in`;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: new URLSearchParams(formData),
    });

    const result = await response.json();

    if (result.status === "success") {
      const token = result.data.token;
      localStorage.setItem("jwtToken", token);

      return redirect("/");
    } else {
      return result;
    }
  } catch (err) {
    console.error(err.message);
  }
};

const dashboardAction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const post = JSON.parse(formData.post);
  const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/posts/${post.id}`;

  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) throw new Error("You must be signed in!");

  try {
    const formattedCategories = post.categories.map((category) => category.id);
    const formattedPost = {
      title: post.title,
      image: post.image,
      content: post.content,
      categories: JSON.stringify(formattedCategories),
      description: post.description,
      published: !post.published,
      author: post.author,
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: new Headers({
        Authorization: `Bearer ${jwtToken}`,
      }),
      body: new URLSearchParams(formattedPost),
    });

    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err.message);
  }
};

const createFormAction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/posts/`;

  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) throw new Error("You must be signed in!");
  console.log(formData.categories);

  try {
    const formattedPost = {
      title: formData.title,
      description: formData.description,
      image: formData.image,
      // array will be parsed back-end
      // we parse it first so it will be recognized when we parse
      // it back on the back-end
      categories: JSON.stringify(JSON.parse(formData.categories)),
      content: formData.content,
      published: formData.published === "on",
      author: Number(formData.author),
    };

    const response = await fetch(url, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${jwtToken}`,
      }),
      body: new URLSearchParams(formattedPost),
    });

    const result = await response.json();
    // delete sessionStorage since it's successful
    if (result.status === "success") {
      return redirect("/");
    } else {
      return result;
    }
  } catch (err) {
    console.error(err.message);
  }
};

const editFormAction = async ({ request }) => {

}

export { signUpAction, signInAction, dashboardAction, createFormAction, editFormAction };
