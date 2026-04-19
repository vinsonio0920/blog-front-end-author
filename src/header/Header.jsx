import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { logoSvg } from "../assets";
import { JwtContext } from "../jwt-context";

const SignOutButton = () => {
  const jwt = useContext(JwtContext);

  function handleSignOutClick() {
    localStorage.removeItem("jwtToken");
    jwt.setJwtToken(null);
  }

  return (
    <button
      type="button"
      className={styles.signOutButton}
      onClick={handleSignOutClick}
    >
      Sign Out
    </button>
  );
};

const Header = () => {
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const jwt = useContext(JwtContext);

  function handleDropdownClick() {
    setDropdownIsOpen(!dropdownIsOpen);
  }

  return (
    <header className={styles.homepageHeader}>
      <nav>
        <ul>
          <li>
            <Link to="/" className={styles.logoLink}>
              <img
                src={logoSvg}
                width="30"
                alt="Logo SVG"
                className={styles.logoSvg}
              />
              <span className={styles.logoText}>Vinson Studio</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              className={styles.burgerMenu}
              aria-label="Open dropdown menu"
              onClick={handleDropdownClick}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <ul
              className={
                styles.rightHeader + (dropdownIsOpen ? ` ${styles.open}` : "")
              }
            >
              <li>
                <Link to="/" onClick={handleDropdownClick}>
                  All Posts
                </Link>
              </li>
              <li>
                <Link to="/create" onClick={handleDropdownClick}>
                  Create Post
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={handleDropdownClick}>
                  About
                </Link>
              </li>
              <li>
                {jwt.jwtToken ? (
                  <SignOutButton />
                ) : (
                  <Link to="/sign-in" onClick={handleDropdownClick}>
                    Sign In
                  </Link>
                )}
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export { Header };
