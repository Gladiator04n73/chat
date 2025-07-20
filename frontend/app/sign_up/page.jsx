"use client"
import React, { useState } from "react";
import { register } from "../utils/auth";
import styles from "./SignUpForm.module.css";
import Link from "next/link";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    console.log('Submitting registration with:', { email: email, name: name, nickname: nickname, password: password }); // Debugging log
    console.log('Email:', email, 'Password:', password);
    console.log('Form values:', { email, name, nickname, password });
    e.preventDefault();
    try {
      const userData = await register(email, name, nickname, password);

    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <div className={styles.signUpContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.formCard}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d243868273ff7b18249857b6c0ab6beeab299ae48c83ff21e308ecbbd651fe71?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
            className={styles.logo}
            alt="Instagram logo"
          />
          <div className={styles.signUpMessage}>
          Зарегистрируйтесь, чтобы просматривать фотографии и видео ваших друзей.
          </div>
          <button className={styles.googleButton}>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/d80e6957f20f7a4f9e0d2e50fb22ed8b86cf155bbe59b4679c88d27baa7797c7?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
              className={styles.googleIcon}
              alt=""
            />
            <span className={styles.googleButtonText}>
            Продолжить с Google
            </span>
          </button>
          <div className={styles.hrContainer}>
            <hr className={styles.hrOnDiv}></hr>
            <div className={styles.divider}>ИЛИ</div>
          </div>
          <form onSubmit={handleSubmit}>
            <input
            type="text"
              id="name"
              className={styles.formInput}
              placeholder="Имя"
              required
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              id="nickname"
              className={styles.formInput}
              placeholder="Имя пользователя"
              required
              onChange={(e) => setNickname(e.target.value)}
            />
            <input
              type="email"
              id="email"
              className={styles.formInput}
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password" className={styles["visually-hidden"]}>
              Пароль
            </label>
            <input
              type="password"
              id="password"
              className={styles.formInput}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className={styles.submitButton}>
              Зарегистрироваться
            </button>
          </form>
          {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}

          <div className={styles.termsText}>
          Регистрируясь, вы соглашаетесь с нашими Условиями, 
          Политикой использования данных и Политикой использования файлов cookie.
          </div>
        </div>
        <div className={styles.loginCard}>
          <div className={styles.loginText}>У вас есть аккаунт?</div>
          <Link href="/auth" className={styles.loginLink}>Войти</Link>
        </div>
        <div className={styles.downloadText}>Загрузите приложение.</div>
        <div className={styles.storeButtons}>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d76e0c135359b5870f3fde9060f7e1ccabec1d359f5a249ebd399671e58e8351?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
            className={styles.storeImage}
            alt="Download on the App Store"
          />
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5bc97bacd269673d546849344267e14052fd8aed6ab6f7730d9c702476af09d?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
            className={styles.storeImage}
            alt="Get it on Google Play"
          />
        </div>
      </div>
    </div>
  );
}
