'use client'
import { useRouter } from 'next/navigation';
import React from "react";
import styles from "../styles/ProfileInfo.module.css";

const ProfileInfo = ({ username, stats, fullName, photo }) => {
  const router = useRouter();
  return (
    <div className={styles.profileInfo}>
      
      {photo && <img src={photo} alt="User Avatar" className={styles.avatar} />}
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.username}>{username}</h1>
          <button className={styles.editButton} onClick={() => router.push('/editProfile')}>
            Редактировать профиль
          </button>
        </div>
        <div className={styles.stats}>
          <div>
            <span className={styles.statValue}>{stats.posts}</span> постов
          </div>
          <div>
            <span className={styles.statValue}>{stats.followers}</span>{" "}
            подписчики
          </div>
          <div>
            <span className={styles.statValue}>{stats.following}</span>{" "}
            подписан
          </div>
        </div>
        <div className={styles.name}>{fullName}</div>
      </div>
    </div>
  );
};

export default ProfileInfo;