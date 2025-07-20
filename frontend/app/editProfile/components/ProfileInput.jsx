'use client'
import React, { useEffect, useState } from "react";
import { useAuth } from '../../providers/AuthProvider';
import styles from "../styles/ProfileInput.module.css";

export function ProfileInput() {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    nickname: '',
    email: 'Email не указан',
    description: 'Введите описание',
    gender: 'Мужской',
    photo: null, 
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = user ? user.id : ''; 
      if (userId) {
        try {
          const response = await fetch(`http://localhost:3001/api/users/${userId}`);
          const data = await response.json();
          if (data) {
            setUserData({
              id: data.id,
              nickname: data.nickname || '',
              email: data.email || '',
              description: data.description || '',
              gender: data.gender || '',
              name: data.name || '',
              photo: data.photo
            });
            setError(null);
          } else {
            setError('Не удалось загрузить данные пользователя. Пожалуйста, войдите в систему.');
          }
        } catch (err) {
          setError('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleUpdatePhoto = async () => {
    const userId = userData.id; 
    const formData = new FormData();
    
    if (userData.photo) {
      formData.append('user[photo]', userData.photo);
      formData.append('user[id]', userId);
    }
  
    const response = await fetch(`http://localhost:3001/api/users/${userId}/update_photo`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
  
    if (response.ok) {
      const updatedUserData = await response.json();
      setUserData(updatedUserData);
      setError(null);
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Ошибка при обновлении фото.');
    }
  };


  const handleSubmit = async (e) => {
    const userId = userData.id; 
    e.preventDefault();

    const payload = { user: { ...userData } };
    // Remove photo from userData in payload because it should be handled separately if needed
    delete payload.user.photo;

    const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const updatedUserData = await response.json();
      setUserData(updatedUserData);
      setError(null);
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'Ошибка при обновлении данных.');
    }
  };
  

  return (
    <div>
      <section className={styles.profileSection}>
        <div className={styles.profileHeader}>

          {user && user.photo && (
              <img 
                src={userData.photo} 
                alt="User Profile" 
                className={styles.avatarContainer} 
              />
            )}
          <div className={styles.profileInfo}>

            <h1 className={styles.username}>{userData.nickname || ''}</h1>
            <input 
              type="file" 
              accept="image/*" 
              className={styles.fileInput}
              onChange={(e) => {
                const file = e.target.files[0];
                setUserData({ ...userData, photo: file });
                console.log('Selected photo:', file); 
              }} 
            />
            <button className={styles.changePhotoButton} onClick={handleUpdatePhoto}>
              Изменить фото профиля
            </button>
          </div>
        </div>
        <div className={styles.profileForm}>
          <form className={styles.inputContainer} onSubmit={handleSubmit}>
            <label className={styles.formLabel}>Имя</label>
            <input 
              className={styles.formInput} 
              value={userData.name || 'Имя пользователя недоступно'} 
              onChange={(e) => setUserData({ ...userData, name: e.target.value })} 
            />
            <div className={styles.helpText}>
              Чтобы помочь людям найти вашу учетную запись, используйте имя, по которому вас знают
              люди, будь то ваше полное имя, псевдоним или название компании.
              Вы можете изменить свое имя только дважды в течение 14-дневного периода.
            </div>
            <label className={styles.formLabel}>Имя пользователя</label>
            <input 
              className={styles.formInput} 
              value={userData.nickname} 
              placeholder={error ? 'Ошибка загрузки имени' : 'Имя пользователя'}
              onChange={(e) => setUserData({ ...userData, nickname: e.target.value })} 
            />
            <div className={styles.helpText}>
              В большинстве случаев вы сможете изменить свое имя пользователя обратно на
              johndoe еще на 14 дней. Дополнительная информация
            </div>
            <label className={styles.formLabel}>Описание</label>
<textarea 
  className={styles.descriptionTextarea} 
  value={userData.description || ''} 
  onChange={(e) => setUserData({ ...userData, description: e.target.value })} 
/>

            <div className={styles.sectionTitle}>Персональная информация</div>
            <div className={styles.helpText}>Предоставьте свою личную информацию,
              даже если учетная запись используется для бизнеса, домашнего животного и т. д.
              Эта информация не будет храниться в вашем общедоступном профиле.
            </div>
            <label className={styles.formLabel}>Email</label>
            <input 
              className={styles.formInput} 
              value={userData.email} 
              placeholder="Введите email"
              onChange={(e) => setUserData({ ...userData, email: e.target.value })} 
            />
            <label className={styles.formLabel}>Пол</label>
            <input className={styles.formInput} 
              value={userData.gender} 
              placeholder="Введите ваш пол"
              onChange={(e) => setUserData({ ...userData, gender: e.target.value })} 
            />
          <button type="submit" className={styles.submitButton}>
            OK
          </button>
          </form>
        </div>
      </section>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
}
