'use client';

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import styles from './styles/Chat.module.css';
import { Header } from './components/Header';
import UserList from './components/UserList';
import ChatWindow from './components/ChatWindow';

export default function ChatPage() {
  const [userId, setUserId] = useState(null); // Changed to state with setter to set actual logged-in user ID
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    async function fetchSessionAndUsers() {
      try {
        // Fetch current session user
        const sessionResponse = await fetch('http://localhost:3001/api/sessions/current', {
          credentials: 'include',
        });
        if (!sessionResponse.ok) {
          throw new Error('Failed to fetch current session');
        }
        const sessionData = await sessionResponse.json();
        setUserId(sessionData.user ? sessionData.user.id : sessionData.id);
        setCurrentUserAvatar(sessionData.avatar || null);

        // Fetch users list
        const usersResponse = await fetch('http://localhost:3001/api/users', {
          credentials: 'include',
        });
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await usersResponse.json();

        // Process avatar URLs to add base URL if missing
        const processedUsers = usersData.map(user => ({
          ...user,
          avatar: user.photo && user.photo.startsWith('http')
            ? user.photo
            : user.avatar && user.avatar.startsWith('http')
              ? user.avatar
              : `http://localhost:3001/${user.avatar || 'default.jpg'}`,
        }));

        setUsers(processedUsers);

        // Added logs for current user and user list
        console.log('Current User:', sessionData);
        console.log('User List:', processedUsers);
      } catch (error) {
        console.error('Error fetching session or users:', error);
      }
    }
    fetchSessionAndUsers();
  }, [setUserId]);

  useEffect(() => {
    if (userId && !socketRef.current) {
      socketRef.current = io('http://localhost:4000');

      socketRef.current.on('connect', () => {
        console.log('Socket connected:', socketRef.current.id);
      });

      socketRef.current.on('unreadCount', ({ fromUserId, count }) => {
        setUnreadCounts(prev => ({
          ...prev,
          [fromUserId]: count,
        }));
      });

      socketRef.current.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
  }, [userId]);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            <div className={styles.sidebarColumn}>
            <UserList
              users={users.filter(user => user.id !== userId && user.id !== null)}
              currentUserAvatar={currentUserAvatar ? (currentUserAvatar.startsWith('http') ? currentUserAvatar : `http://localhost:3001/${currentUserAvatar}`) : null}
              onSelectUser={setSelectedUserId}
              selectedUserId={selectedUserId}
              unreadCounts={unreadCounts}
            />
            </div>

          <section className={styles.mainSection} style={{ display: 'flex', height: '600px' }}>
            <ChatWindow
              userId={userId}
              chatPartnerId={selectedUserId}
              chatPartnerUser={users.find(user => user.id === selectedUserId) || null}
              socket={socketRef.current}
            />
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}
