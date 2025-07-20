'use client';

import React, { useState, useEffect } from "react";
import { checkSession } from "../utils/api";
import styles from "./styles/ChangePassword.module.css";
import { Header } from "./components/Header";
import { PasswordInput } from "./components/PasswordInput";
import { Sidebar } from "./components/Sidebar";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    'prev-password': '',
    'new-password': '',
    'confirm-password': ''
  });

  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await checkSession();
      setUsername(userData.nickname);
      setPhoto(userData.photo);
    };

    fetchUserData();
  }, []);

  const passwordInputs = [
    { label: "Предыдущий пароль", id: "prev-password" },
    { label: "Новый пароль", id: "new-password" },
    { label: "Подтвердите новый пароль", id: "confirm-password" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (formData['new-password'] !== formData['confirm-password']) {
      setError('Новый пароль и подтверждение должны совпадать');
      setLoading(false);
      return;
    }

    if (formData['new-password'].length < 8) {
      setError('Пароль должен содержать не менее 8 символов');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration: {
            currentPassword: formData['prev-password'],
            newPassword: formData['new-password']
          }
        }),
        credentials: 'include'
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось изменить пароль. Пожалуйста, попробуйте еще раз.');
      }

      setSuccess(true);
      setError('');
      setFormData({
        'prev-password': '',
        'new-password': '', 
        'confirm-password': ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <div className={styles.sidebarColumn}>
            <Sidebar />
          </div>

          <section className={styles.mainSection}>
            <div className={styles.userInfo}>
              {photo && <img src={photo} alt="User Avatar" className={styles.userAvatar} />}
              <span className={styles.username}>{username}</span>
            </div>

            <form className={styles.passwordForm} onSubmit={handleSubmit}>
              {passwordInputs.map((input) => (
                <PasswordInput
                  key={input.id}
                  label={input.label}
                  id={input.id}
                  value={formData[input.id]}
                  onChange={(value) => handleInputChange(input.id, value)}
                />
              ))}
              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>Пароль успешно изменен!</div>}
              {loading && <div className={styles.loadingMessage}>Загрузка...</div>}
              <div className={styles.footerForm}>            
                <button type="submit" className={styles.submitButton} disabled={loading}>
                  Изменить пароль
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
