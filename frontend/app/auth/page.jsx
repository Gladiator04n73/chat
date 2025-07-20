'use client'
import { React, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./LoginPage.module.css";
import { ImageSlider } from "./components/ImageSlider";
import { StoreButtons } from "./components/StoreButtons";
import { login } from '../utils/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email и пароль обязательны');
      return;
    }

    try {
      const userData = await login(email, password);
      if (userData && userData.alreadyLoggedIn) {
        router.push('/feed');
        return;
      }
      router.push('/feed');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Произошла ошибка при входе. Попробуйте еще раз.');
    }
  };

  return (
    <main className={styles.loginContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.twoColumnLayout}>
          <div className={styles.leftColumn}>
            <ImageSlider
              mainImage="https://cdn.builder.io/api/v1/image/assets/TEMP/b9a9e2a7b5bca08458b3d0d8338dd9258ca91a4002376d355a98888d708c7bf5?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
              overlayImage="https://cdn.builder.io/api/v1/image/assets/TEMP/3bcc1fd7e832c743afcd2f4f1fc8eba4277bbe0ea9aff6ae60d937476f88f504?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
            />
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.formSection}>
              <form className={styles.loginForm} onSubmit={handleSubmit}>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/d243868273ff7b18249857b6c0ab6beeab299ae48c83ff21e308ecbbd651fe71?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
                  className={styles.logo}
                  alt="Instagram Logo"
                />
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Username, or mail"
                  aria-label="Username or email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  className={styles.inputField}
                  placeholder="Password"
                  aria-label="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className={styles.loginButton}>
                  Войти
                </button>
                {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
                <div className={styles.hrContainer}>
                  <hr className={styles.hrOnDiv}></hr>
                  <div className={styles.divider}>ИЛИ</div>
                </div>
                <button type="button" className={styles.googleButton}>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/d80e6957f20f7a4f9e0d2e50fb22ed8b86cf155bbe59b4679c88d27baa7797c7?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
                    className={styles.googleIcon}
                    alt=""
                  />
                  <span>Продолжить с Google</span>
                </button>
                <button type="button" className={styles.forgotPassword}>
                  Вы забыли пароль?
                </button>
              </form>
              <div className={styles.signupPrompt}>
                <span>У вас нет аккаунта?</span>
                <button type="button" className={styles.signupButton} onClick={() => router.push('/sign_up')}>
                    Зарегистрироваться
                </button>
              </div>
              <p className={styles.downloadPrompt}>Загрузите приложение.</p>
              <StoreButtons
                appStoreImage="https://cdn.builder.io/api/v1/image/assets/TEMP/d76e0c135359b5870f3fde9060f7e1ccabec1d359f5a249ebd399671e58e8351?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
                playStoreImage="https://cdn.builder.io/api/v1/image/assets/TEMP/b5bc97bacd269673d546849344267e14052fd8aed6ab6f7730d9c702476af09d?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
