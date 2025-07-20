'use client';
import React from "react";
import { useRouter } from 'next/navigation';
import { SuggestionItem } from "./SuggestionItem";
import styles from "../styles/Sidebar.module.css";

export const Sidebar = () => {
  const [suggestions, setSuggestions] = React.useState([]);
  const [currentUserId, setCurrentUserId] = React.useState('');
  const [followingIds, setFollowingIds] = React.useState(new Set());

  React.useEffect(() => {
    const fetchSuggestions = async (currentUserId) => {
      try {
        const response = await fetch('http://localhost:3001/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const filteredSuggestions = data ? data.filter(user => {
          if (user.id === currentUserId) {
            return false;
          }
          return true;
        }) : [];
        
        const suggestionsWithFollowStatus = filteredSuggestions.map(user => ({
          ...user,
          isFollowing: followingIds.has(user.id)
        }));
        
        setSuggestions(suggestionsWithFollowStatus);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/sessions/current', {
          credentials: 'include'
        });
        
        if (response.status === 401) {
          return;
        }
        
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data && data.user && data.user.id) {
          setCurrentUserId(data.user.id);
          await fetchSuggestions(data.user.id);
          await fetchFollowing(data.user.id);
        } else {
          console.error('Current user data is invalid:', data);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    const fetchFollowing = async (userId) => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/following`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch following users: ${response.statusText}`);
        }
        const data = await response.json();
        setFollowingIds(new Set(data.map(user => user.id)));
      } catch (error) {
        console.error('Error fetching following users:', error);
      }
    };

    const fetchData = async () => {
      await fetchCurrentUser();
    };

    fetchData();
  }, []);

  const router = useRouter();

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.suggestionsHeader}>
          <div className={styles.suggestionsTitle}>Предложения для вас</div>
        </div>
        <div className={styles.suggestionsList}>
          {suggestions.map((suggestion) => (
          <SuggestionItem
            avatar={suggestion.photo}
              key={suggestion.nickname}
              nickname={suggestion.nickname}
              userId={suggestion.id}
              isFollowing={suggestion.isFollowing}
              onClick={() => {
                router.push(`/profile/${suggestion.id}`);
              }}
            />
          ))}
        </div>
        <div className={styles.footer}>
          Информация · Помощь · Заключенный · API · Работа · Конфиденциальность · Условия ·
          Местоположения · Популярные аккаунты · Хэштеги · Язык
        </div>
        <div className={styles.copyright}>© ИНСТАГРАМ 2025</div>
      </div>
    </>
  );
};
