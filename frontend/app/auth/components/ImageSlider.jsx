import React from "react";
import styles from "./ImageSlider.module.css";

export const ImageSlider = ({ mainImage, overlayImage }) => {
  return (
    <div className={styles.sliderContainer}>
      <img
        loading="lazy"
        src={mainImage}
        className={styles.backgroundImage}
        alt=""
      />
      <img
        loading="lazy"
        src={overlayImage}
        className={styles.overlayImage}
        alt=""
      />
    </div>
  );
};
