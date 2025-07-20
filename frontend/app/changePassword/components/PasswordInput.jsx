'use client';

import React, { useState, useEffect } from "react";
import styles from "../styles/PasswordInput.module.css";

export const PasswordInput = ({ label, id, value = '', onChange }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={id} className={styles.inputLabel}>
        {label}
      </label>
      <input
        type="password"
        id={id}
        className={styles.inputField}
        aria-label={label}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
