import { useContext, useEffect, useState } from "react";
import { Link, useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { JwtContext } from "../jwt-context.js";
import styles from "./EditPost.module.css";
import { jwtDecode } from "jwt-decode";
import { Editor } from "@tinymce/tinymce-react";
import { Preview } from "../preview/Preview.jsx";
import { Comments } from "../comments/Comments.jsx";

// we will have multiple sessionStorage data for each edited post!
// that we do don't have to worry about users losing data

const ContentInput = ({ formErrors, formData, setFormData }) => {
  const handleContentChange = (newValue) => {
    const newFormData = {
      ...formData,
      content: newValue,
    };
    setFormData(newFormData);
    sessionStorage.setItem(
      `formData${formData.id}`,
      JSON.stringify(newFormData),
    );
  };

  return (
    <>
      <input
        type="hidden"
        id="content"
        name="content"
        required
        value={formData.content}
      />
      <div className={formErrors["content"] && styles.invalid}>
        <Editor
          apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
          value={formData.content}
          init={{
            height: 500,
            menubar: false,
            placeholder: "Write down your thoughts!",
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "preview",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
          onEditorChange={(newValue) => handleContentChange(newValue)}
        />
      </div>
    </>
  );
};

const CategoryDropdown = ({
  jwtToken,
  categories,
  setCategories,
  formData,
  setFormData,
}) => {
  // filter down to related categories (limit 5)
  const categoryValue = formData.categorySearch;
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categoryValue.trim().toLowerCase()),
  );
  const categoriesResult = filteredCategories.slice(0, 5);

  const handleCategoryLiClick = (event) => {
    const categoryId = event.currentTarget.dataset.id;
    const categoryName = event.currentTarget.dataset.name;

    // returns if category is already selected
    if (formData.categories.includes(Number(categoryId))) return;

    // add category to hidden input
    const newSelectedCategories = [...formData.categories, Number(categoryId)];
    // update formData state
    const newFormData = {
      ...formData,
      categorySearch: "",
      categories: newSelectedCategories,
      categoryObjects: [
        ...formData.categoryObjects,
        { id: categoryId, name: categoryName },
      ],
    };
    setFormData(newFormData);
    sessionStorage.setItem(
      `formData${formData.id}`,
      JSON.stringify(newFormData),
    );
  };

  const handleAddCategoryClick = async () => {
    // post new category to the database
    const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/categories`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${jwtToken}`,
        }),
        body: new URLSearchParams({
          name: categoryValue,
        }),
      });

      const result = await response.json();
      if (result.status === "error") {
        // add error stuff here.
      }

      // add category to selectedCategories
      const category = result.data;
      const newCategories = [...categories, category];
      const newSelectedCategories = [...formData.categories, category.id];

      // this updates the categories we fetched
      setCategories(newCategories);
      const newFormData = {
        ...formData,
        categories: newSelectedCategories,
        categoryObjects: [
          ...formData.categoryObjects,
          { id: category.id, name: category.name },
        ],
        categorySearch: "",
      };
      setFormData(newFormData);
      sessionStorage.setItem(
        `formData${formData.id}`,
        JSON.stringify(newFormData),
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  if (categoriesResult.length >= 1) {
    return (
      <div className={styles.categoriesDropdown}>
        <ul className={styles.categoriesList}>
          {categoriesResult.map((category) => (
            <li
              key={category.id}
              onClick={handleCategoryLiClick}
              data-id={category.id}
              data-name={category.name}
            >
              {category.name}
              {formData.categories.includes(category.id) ? (
                <span
                  className={`material-symbols-outlined ${styles.checkIcon}`}
                >
                  check
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div className={styles.categoriesDropdown}>
        <p>No categories found.</p>
        <button
          type="button"
          className={styles.createButton}
          onClick={handleAddCategoryClick}
        >
          <span className="material-symbols-outlined">add</span>
          Create category "{categoryValue}"
        </button>
      </div>
    );
  }
};

const ErrorElement = ({ message }) => {
  return <p className={styles.error}>{message}</p>;
};

const FormTab = ({ jwt, formData, setFormData }) => {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    // gets the categories on mount (setState will update it accordingly)
    const fetchData = async () => {
      // fetch categories and set it to categories
      // this is so that the category input can work correctly
      const url = `${import.meta.env.VITE_BLOG_API_WEBSITE}/categories`;

      try {
        const response = await fetch(url);

        const result = await response.json();
        if (result.status === "error")
          throw new Error("Problem occurred while fetching categories");

        setCategories(result.data);
      } catch (err) {
        console.error(err.message);
        setCategories("error");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // window event listener to remove categoryDropdown when clicked out
    const onWindowClick = (event) => {
      if (!event.target.classList.contains("categoryField")) {
        setShowCategoryDropdown(false);
      }
    };

    window.addEventListener("click", onWindowClick);

    return () => {
      window.removeEventListener("click", onWindowClick);
    };
  }, []);

  if (!jwt.jwtToken) {
    return (
      <div className="errorContainer">
        <p className="errorPara">You are not currently signed in.</p>
        <Link to="/sign-in">Sign in now</Link>
      </div>
    );
  } else if (categories === "error") {
    return (
      <div className="errorContainer">
        <p className="errorPara">
          There was an error getting the categories. Please try again later.
        </p>
      </div>
    );
  }

  const user = jwtDecode(jwt.jwtToken).user;
  const formErrors = {};
  // make errors into key-value pairs for easier retrieval (if any)
  fetcher.data?.errors.map((error) => {
    formErrors[error.path] = error.msg;
  });

  const handleCancelClick = () => {
    // reset session data and redirect user back to the homepage
    sessionStorage.removeItem(`formData${formData.id}`);
    navigate("/");
  };

  const handleCategoryClick = () => {
    setShowCategoryDropdown(true);
  };

  const handleCategoryDeleteClick = (event) => {
    const categoryId = event.currentTarget.dataset.id;

    const newSelectedCategories = formData.categories.filter(
      (currentCategoryId) => currentCategoryId !== Number(categoryId),
    );

    const newCategoryObjects = formData.categoryObjects.filter(
      (category) => Number(category.id) !== Number(categoryId),
    );
    const newFormData = {
      ...formData,
      categories: newSelectedCategories,
      categoryObjects: newCategoryObjects,
    };
    setFormData(newFormData);
    sessionStorage.setItem(
      `formData${formData.id}`,
      JSON.stringify(newFormData),
    );
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    // save form data so it persists between tabs
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(newFormData);
    sessionStorage.setItem(
      `formData${formData.id}`,
      JSON.stringify(newFormData),
    );
  };

  return (
    <fetcher.Form method="POST" className="createForm">
      <h1>Edit Post</h1>
      <section>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            maxLength="64"
            className={formErrors["title"] && styles.invalid}
            value={formData.title}
            onChange={handleFormChange}
          />
          {formErrors["title"] && (
            <ErrorElement message={formErrors["title"]} />
          )}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            required
            maxLength="254"
            className={formErrors["description"] && styles.invalid}
            value={formData.description}
            onChange={handleFormChange}
          />
          {formErrors["description"] && (
            <ErrorElement message={formErrors["description"]} />
          )}
        </div>
        <div>
          <label htmlFor="image">Image Link</label>
          <input
            type="text"
            id="image"
            name="image"
            required
            className={formErrors["image"] && styles.invalid}
            value={formData.image}
            onChange={handleFormChange}
          />
          {formErrors["image"] && (
            <ErrorElement message={formErrors["image"]} />
          )}
        </div>
        <div>
          <label htmlFor="categorySearch" className="categoryField">
            Categories
          </label>
          {formData.categories.length > 0 && (
            <ul className={styles.selectedUl}>
              {formData.categories.map((categoryId) => (
                <li key={categoryId} className={styles.selectedCategory}>
                  {categories &&
                    categories.find((category) => category.id === categoryId)
                      .name}
                  <button
                    type="button"
                    className={styles.closeButton}
                    aria-label="Delete category"
                    onClick={handleCategoryDeleteClick}
                    data-id={categoryId}
                  >
                    <span
                      className={`material-symbols-outlined ${styles.closeIcon}`}
                    >
                      close
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <input
            type="text"
            id="categorySearch"
            name="categorySearch"
            className={`categoryField ${formErrors["categories"] && styles.invalid}`}
            onClick={handleCategoryClick}
            autoComplete="off"
            value={formData.categorySearch}
            onChange={handleFormChange}
          />
          {showCategoryDropdown && (
            <CategoryDropdown
              jwtToken={jwt.jwtToken}
              categories={categories}
              setCategories={setCategories}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {formErrors["categories"] && (
            <ErrorElement message={formErrors["categories"]} />
          )}
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <ContentInput
            formErrors={formErrors}
            formData={formData}
            setFormData={setFormData}
          />
          {formErrors["content"] && (
            <ErrorElement message={formErrors["content"]} />
          )}
        </div>
        <div className={styles.publishedInput}>
          <label htmlFor="published" className={styles.checkboxContainer}>
            Publish article?
            <input
              type="checkbox"
              id="published"
              name="published"
              className={formErrors["published"] && styles.invalid}
              defaultChecked={formData.published}
            />
            <span className={styles.checkmark}></span>
          </label>
          {formErrors["published"] && (
            <ErrorElement message={formErrors["published"]} />
          )}
        </div>
        <div>
          <input
            type="hidden"
            id="categories"
            name="categories"
            value={JSON.stringify(formData.categories)}
          />
          <input type="hidden" id="action" name="action" value="edit" />
        </div>
        <div>
          <input type="hidden" id="author" name="author" value={user.id} />
        </div>
      </section>
      <section>
        <div className={styles.confirmationButtons}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancelClick}
          >
            Cancel
          </button>
          <button type="submit" className={styles.confirmButton}>
            Update
          </button>
        </div>
      </section>
    </fetcher.Form>
  );
};

const EditForm = () => {
  const jwt = useContext(JwtContext);
  const { result } = useLoaderData();
  const postData = result.data;
  const [currentTab, setCurrentTab] = useState("form");
  const [formData, setFormData] = useState(
    JSON.parse(sessionStorage.getItem(`formData${result.data.id}`)) ?? {
      id: postData.id,
      title: postData.title,
      description: postData.description,
      image: postData.image,
      categorySearch: "",
      categories: postData.categories.map((category) => category.id),
      content: postData.content,
      published: postData.published,
      // names and id of categories for the preview only
      categoryObjects: postData.categories,
    },
  );

  if (!jwt.jwtToken) {
    return (
      <div className="errorContainer">
        <p className="errorPara">You are not currently signed in.</p>
        <Link to="/sign-in">Sign in now</Link>
      </div>
    );
  } else if (result.status === "error" && result.error === "forbidden") {
    return (
      <div className="errorContainer">
        <p className="errorPara">You are not allowed to edit this post.</p>
        <Link to="/">Go back to the homepage</Link>
      </div>
    );
  } else if (result.status === "error") {
    return (
      <div className="errorContainer">
        <p className="errorPara">
          There was an error loading the post. Please try again later.
        </p>
        <Link to="/sign-in">Go back to the homepage</Link>
      </div>
    );
  }

  const handleTabClick = (event) => {
    const tab = event.currentTarget.dataset.tab;
    setCurrentTab(tab);
  };

  const renderedTab = () => {
    switch (currentTab) {
      case "form":
        return (
          <FormTab jwt={jwt} formData={formData} setFormData={setFormData} />
        );
      case "preview":
        return <Preview formData={formData} />;
      case "comments":
        return <Comments postId={postData.id} />;
    }
  };

  return (
    <>
      <div className={styles.modeTabs}>
        <button
          type="button"
          onClick={handleTabClick}
          className={currentTab === "form" ? styles.selected : null}
          data-tab="form"
        >
          Form
        </button>
        <button
          type="button"
          onClick={handleTabClick}
          className={currentTab === "preview" ? styles.selected : null}
          data-tab="preview"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={handleTabClick}
          className={currentTab === "comments" ? styles.selected : null}
          data-tab="comments"
        >
          Comments
        </button>
      </div>
      {renderedTab()}
    </>
  );
};

export { EditForm };
