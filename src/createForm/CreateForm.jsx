import { useContext } from "react";
import { JwtContext } from "../jwt-context";
import styles from "./CreateForm.module.css";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { Link, useFetcher } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { format } from "date-fns";

const ContentInput = ({ formErrors, formData, setFormData }) => {
  const handleContentChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      content: newValue,
    }));
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
          initialValue={formData.content}
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
  categories,
  categoryValue,
  setCategoryValue,
  selectedCategories,
  setSelectedCategories,
  setCategories,
  setFormData,
}) => {
  const jwtToken = localStorage.getItem("jwtToken");
  if (!jwtToken) throw new Error("You must be signed in!");

  // filter down to related categories (limit 5)
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categoryValue.trim().toLowerCase()),
  );
  const categoriesResult = filteredCategories.slice(0, 5);

  const handleCategoryLiClick = (event) => {
    const categoryId = event.currentTarget.dataset.id;

    // returns if category is already selected
    if (selectedCategories.includes(Number(categoryId))) return;

    // add category to hidden input
    const newSelectedCategories = [...selectedCategories, Number(categoryId)];
    setSelectedCategories(newSelectedCategories);

    // update formData state
    setFormData((prev) => ({
      ...prev,
      categories: newSelectedCategories,
    }));
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
      const newSelectedCategories = [...selectedCategories, category.id];

      setCategories(newCategories);
      setSelectedCategories(newSelectedCategories);
      setCategoryValue("");
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
            >
              {category.name}
              {selectedCategories.includes(category.id) ? (
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

const FormTab = ({ formData, setFormData }) => {
  const fetcher = useFetcher();
  const jwt = useContext(JwtContext);
  const [categoryValue, setCategoryValue] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState(null);

  const user = jwtDecode(jwt.jwtToken).user;
  const formErrors = {};
  // make errors into key-value pairs for easier retrieval (if any)
  fetcher.data?.errors.map((error) => {
    formErrors[error.path] = error.msg;
  });

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
      <div className={styles.errorContainer}>
        <p className={styles.errorPara}>You are not currently signed in.</p>
        <Link to="/sign-in">Sign in now</Link>
      </div>
    );
  } else if (categories === "error") {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorPara}>
          There was an error getting the categories. Please try again later.
        </p>
      </div>
    );
  }

  const handleCategoryChange = (event) => {
    setCategoryValue(event.target.value);
  };

  const handleCategoryClick = () => {
    setShowCategoryDropdown(true);
  };

  const handleCategoryDeleteClick = (event) => {
    const categoryId = event.currentTarget.dataset.id;

    const newSelectedCategories = selectedCategories.filter(
      (currentCategoryId) => currentCategoryId !== Number(categoryId),
    );
    setSelectedCategories(newSelectedCategories);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    // save form data so it persists between tabs
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <fetcher.Form method="POST" className="createForm">
      <h1>Create New Post</h1>
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
          {selectedCategories.length > 0 && (
            <ul className={styles.selectedUl}>
              {selectedCategories.map((categoryId) => (
                <li key={categoryId} className={styles.selectedCategory}>
                  {
                    categories.find((category) => category.id === categoryId)
                      .name
                  }
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
            onChange={handleCategoryChange}
            onClick={handleCategoryClick}
            value={categoryValue}
            autoComplete="off"
            value={formData.categorySearch}
            onChange={handleFormChange}
          />
          {showCategoryDropdown && (
            <CategoryDropdown
              categories={categories}
              categoryValue={categoryValue}
              setCategoryValue={setCategoryValue}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              setCategories={setCategories}
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
            name="categories"
            value={JSON.stringify(selectedCategories)}
          />
        </div>
        <div>
          <input type="hidden" id="author" name="author" value={user.id} />
        </div>
      </section>
      <section>
        <div className={styles.confirmationButtons}>
          <button type="button" className={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={styles.confirmButton}>
            Create
          </button>
        </div>
      </section>
    </fetcher.Form>
  );
};

const PreviewTab = ({ formData }) => {
  const jwtToken = localStorage.getItem("jwtToken");
  const decoded = jwtDecode(jwtToken);

  const { title, image, content } = formData;
  const currentDate = new Date();
  const formattedDate = format(currentDate, "MMM d, y");
  const author = decoded.user.name;

  return (
    <>
      <header>
        <p>{formattedDate}</p>
      </header>
      <h1>{title || "[Your Title Here]"}</h1>
      <img
        src={
          image ||
          "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png?_=20210521171500"
        }
        alt="Article image"
      />
      <p>Posted by {author}. No comments yet.</p>
      <div className="content">
        {content ? (
          parse(DOMPurify.sanitize(content))
        ) : (
          <p>Write your thoughts here!</p>
        )}
      </div>
      <h2>Comments</h2>
    </>
  );
};

const CreateForm = () => {
  const [currentTab, setCurrentTab] = useState("form");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    categorySearch: "",
    categories: [],
    content: "",
    published: true,
    // author is already in localStorage
  });

  const handleTabClick = (event) => {
    const tab = event.currentTarget.dataset.tab;

    if (tab === "preview") {
      // we save again mainly for the hidden inputs
      const form = document.querySelector(".createForm");
      const currentFormState = new FormData(form);

      setFormData(Object.fromEntries(currentFormState));
    }

    setCurrentTab(tab);
  };

  return (
    <>
      <div className={styles.modeTabs}>
        <button
          type="button"
          onClick={handleTabClick}
          className={currentTab === "form" && styles.selected}
          data-tab="form"
        >
          Form
        </button>
        <button
          type="button"
          onClick={handleTabClick}
          className={currentTab === "preview" && styles.selected}
          data-tab="preview"
        >
          Preview
        </button>
      </div>
      {currentTab === "form" ? (
        <FormTab formData={formData} setFormData={setFormData} />
      ) : (
        <PreviewTab formData={formData} />
      )}
    </>
  );
};

export { CreateForm };
