import React from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ProfileInput } from "./components/ProfileInput";
import styles from "./styles/EditProfilePage.module.css";



export default function EditProfilePage() {
  return (
    <div className={styles.editProfile}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.contentGrid}>
          <div className={styles.sidebarColumn}>
            <Sidebar />
          </div>
                  <ProfileInput />
        </div>
      </main>
    </div>
  );
};
