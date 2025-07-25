'use client';

import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import styles from '../styles/ChatWindow.module.css';

const CHAT_SERVER_URL = 'http://localhost:4000';

export default function ChatWindow({ userId, chatPartnerId, chatPartnerUser }) {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(CHAT_SERVER_URL);
    }
  }, []);

  
  useEffect(() => {
    if (!userId || !chatPartnerId || !socketRef.current) return;

    const socket = socketRef.current;
    const room = [userId, chatPartnerId].sort().join('_');

    
    socket.emit('leaveAllRooms');

    socket.emit('joinRoom', { user1: userId, user2: chatPartnerId });

    
    setMessages([]);

    
    socket.emit('markAsRead', { userId, fromUserId: chatPartnerId });

    
    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [userId, chatPartnerId]);

  const sendMessage = () => {
    if (input.trim() === '' || !socketRef.current) return;

    socketRef.current.emit('sendMessage', {
      sender_id: userId,
      receiver_id: chatPartnerId,
      content: input.trim(),
    });

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!userId || !chatPartnerId) {
    return <div className={styles.userInfo}>Выберите пользователя для начала чата</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.chatHeader}>
        {chatPartnerUser && (
          <>
            <img
              src={chatPartnerUser.avatar || '/default.jpg'}
              alt={`${chatPartnerUser.nickname || `User ${chatPartnerUser.id}`} avatar`}
              className={styles.userAvatar}
            />
            <span>{chatPartnerUser.nickname || `пользователем ${chatPartnerUser.id}`}</span>
          </>
        )}
        {!chatPartnerUser && <span>{chatPartnerId}</span>}
      </div>
      <div className={styles.chatMessages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender_id === userId ? styles.messageSent : styles.messageReceived}
          >
            <div className={styles.message}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        className={styles.inputField}
      />
      <button onClick={sendMessage} className={styles.sendButton}>
        Отправить
      </button>
    </div>
  );
}
