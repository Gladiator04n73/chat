import React from "react";
import styles from "./StoreButtons.module.css";

export const StoreButtons = ({ appStoreImage, playStoreImage }) => {
  return (
    <div className={styles.storeButtonsContainer}>
      <img
        loading="lazy"
        src={appStoreImage}
        className={styles.storeButton}
        alt="Download on App Store"
      />
      <img
        loading="lazy"
        src={playStoreImage}
        className={styles.storeButton}
        alt="Get it on Google Play"
      />
    </div>
  );
};
