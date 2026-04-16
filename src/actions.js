import { redirect } from "react-router-dom";

const signUpAction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  const url = "http://localhost:3000/sign-up";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: new URLSearchParams(formData),
    });

    const result = await response.json();

    if (result.status === "success") {
      // automatically sign in user for convenience
      const signInUrl = "http://localhost:3000/sign-in";

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
  const url = "http://localhost:3000/sign-in";

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
  const url = `http://localhost:3000/posts/${post.id}`;

  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) throw new Error("You must be signed in!");

  try {
    const formattedPost = {
      title: post.title,
      image: post.image,
      content: post.content,
      categories: JSON.stringify(post.categories),
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
    if (result.status === "success") {
      return redirect("/");
    } else {
      // we could add an error!
      throw new Error("There was a problem updating the post!");
    }
  } catch (err) {
    console.error(err.message);
  }
};

export { signUpAction, signInAction, dashboardAction };
