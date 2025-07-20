'use client';

import React from 'react';
import styles from '../styles/UserList.module.css';

export default function UserList({ users, onSelectUser, selectedUserId, currentUserAvatar, unreadCounts }) {
  return (
    <aside className={styles.leftsideBg}>
      <h2 className={styles.accountsCenter}>Пользователи</h2>
      {currentUserAvatar && (
        <div className={styles.currentUser}>
          <img
            src={currentUserAvatar || '/default.jpg'}
            alt="Current User Avatar"
            className={styles.userAvatar}
          />
          <span>Вы</span>
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {users.map(user => (
          <li
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`${styles.userItem} ${user.id === selectedUserId ? styles.userItemSelected : ''}`}
            style={{ position: 'relative' }}
          >
            <img
              src={user.avatar || '/default.jpg'}
              alt={`${user.nickname || `User ${user.id}`} avatar`}
              className={styles.userAvatar}
            />
            {user.nickname || `User ${user.id}`}
            {unreadCounts && unreadCounts[user.id] > 0 && (
              <span className={styles.unreadBadge}>{unreadCounts[user.id]}</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
