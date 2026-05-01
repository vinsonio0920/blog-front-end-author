import { loadingSvg } from "../assets";
import styles from "./LoadingScreen.module.css";

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <img
        src={loadingSvg}
        alt="Loading spinner"
        className={styles.loadingSvg}
      />
    </div>
  );
};

export { LoadingScreen };
