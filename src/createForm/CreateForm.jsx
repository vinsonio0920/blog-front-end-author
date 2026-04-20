import { useContext } from "react";
import { JwtContext } from "../jwt-context";
import styles from "./CreateForm.module.css";
import { Form, Link, useLoaderData } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

const CategoryDropdown = ({
  categories,
  categoryValue,
  selectedCategories,
  setSelectedCategories,
}) => {
  // filter down to related categories (limit 5)
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categoryValue.toLowerCase()),
  );
  const categoriesResult = filteredCategories.slice(0, 5);

  const handleCategoryLiClick = (event) => {
    const categoryId = event.currentTarget.dataset.id;

    // returns if category is already selected
    if (selectedCategories.includes(Number(categoryId))) return;

    // add category to hidden input
    const newSelectedCategories = [...selectedCategories, Number(categoryId)];
    setSelectedCategories(newSelectedCategories);
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
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div className={styles.categoriesDropdown}>
        <p>No categories found.</p>
      </div>
    );
  }
};

const CreateForm = () => {
  const jwt = useContext(JwtContext);
  const [categoryValue, setCategoryValue] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { result } = useLoaderData();

  const categories = result.data;

  // window event listener to remove categoryDropdown when clicked out
  useEffect(() => {
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
  }

  const handleCategoryChange = (event) => {
    setCategoryValue(event.target.value);
  };

  const handleCategoryClick = () => {
    setShowCategoryDropdown(true);
  };

  return (
    <Form method="PoST">
      <h1>Create New Post</h1>
      <section>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" required maxLength="64" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            required
            maxLength="254"
          />
        </div>
        <div>
          <label htmlFor="image">Image Link</label>
          <input type="text" id="image" name="image" required />
        </div>
        <div>
          <label htmlFor="categorySearch" className="categoryField">
            Categories
          </label>
          <ul className={styles.selectedUl}>
            {selectedCategories.map((categoryId) => (
              <li key={categoryId} className={styles.selectedCategory}>
                {categories.find((category) => category.id === categoryId).name}
                <button type="button" className={styles.closeButton}>
                  <span
                    className={`material-symbols-outlined ${styles.closeIcon}`}
                  >
                    close
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            id="categorySearch"
            name="categorySearch"
            required
            className="categoryField"
            onChange={handleCategoryChange}
            onClick={handleCategoryClick}
          />
          {showCategoryDropdown ? (
            <CategoryDropdown
              categories={categories}
              categoryValue={categoryValue}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          ) : null}
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <input type="text" id="content" name="content" required />
        </div>
        <div className={styles.publishedInput}>
          <label htmlFor="published" className={styles.checkboxContainer}>
            Publish article?
            <input
              type="checkbox"
              id="published"
              name="published"
              defaultChecked
            />
            <span className={styles.checkmark}></span>
          </label>
        </div>
        <div>
          <input
            type="hidden"
            name="categories"
            value={JSON.stringify(selectedCategories)}
          />
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
    </Form>
  );
};

export { CreateForm };
