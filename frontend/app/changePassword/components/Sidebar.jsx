'use client'
import React from "react";
import { useRouter } from 'next/navigation';
import styles from "../styles/Sidebar.module.css";

export const Sidebar = () => {
  const router = useRouter();
  return (
    <aside className={styles.leftsideBg}>
        <button className={styles.editProfileText} onClick={() => router.push('/editProfile')}>
          Редактировать профиль</button>
      <div className={styles.sectionEdit}>
       <div className={styles.activeBorder} />
        <div className={styles.changePassword}>Изменить пароль</div>
      </div>
      <div className={styles.accountsSection}>
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/7420cc788f7fb5c78060fc4d0cb8088de583617caf2bc61817b802047bdcf23d?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
          className={styles.accountsIcon}
          alt=""
        />
        <h2 className={styles.accountsCenter}>Центр учета</h2>
        <p className={styles.accountsDescription}>
        Управляйте настройками для подключенных приложений в Instagram, 
        Facebook и Messenger, включая обмен историями и публикациями, 
        а также вход в систему.
        </p>
      </div>
    </aside>
  );
};
