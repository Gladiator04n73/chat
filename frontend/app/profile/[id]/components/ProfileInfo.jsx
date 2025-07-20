'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import styles from "../styles/ProfileInfo.module.css";

const ProfileInfo = ({ username, stats, fullName, userId, isFollowing = false, currentUserId, updateStats, profilePicture }) => {
  const [following, setFollowing] = useState(isFollowing);
  useEffect(() => {
    const checkFollowingStatus = async () => {
      console.log(`User ID for following status check: ${userId}`);
      try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}/following_status`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setFollowing(data.following);
        } else {
          console.error('Failed to fetch following status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error checking following status:', error);
      }
    };

    checkFollowingStatus();
  }, [userId]);

  const router = useRouter();

  const handleFollow = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}/follow`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followerId: currentUserId, followedId: userId })
      });
      if (!response.ok) {
        throw new Error('Failed to follow user');
      }
      setFollowing(true);
      updateStats(1); 
      console.log('Followed user:', userId);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}/unfollow`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followerId: currentUserId, followedId: userId })
      });
      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }
      setFollowing(false);
      updateStats(-1);
      console.log('Unfollowed user:', userId);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleToggleFollow = () => {
    if (following) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return (
    <div className={styles.profileInfo}>
      <img
        src={profilePicture || '/default.jpg'}
        alt={`${username}'s profile`} 
        className={styles.avatar} 
        onLoad={() => console.log(`Profile picture loaded: ${profilePicture}`)} 
        onError={() => console.error(`Failed to load profile picture: ${profilePicture}`)} 
      />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.username}>{username}</h1>
          {userId !== currentUserId && (
            <button className={following ? styles.unfollowButton : styles.followButton} 
            onClick={handleToggleFollow}>
              {following ? 'Отписаться' : 'Подписаться'}
            </button>
          )}
        </div>
        <div className={styles.stats}>
          <div>
            посты: <span className={styles.statValue}>{stats.posts}</span> 
          </div>
          <div>
            подписчики: <span className={styles.statValue}>{stats.followers}</span>
          </div>
          <div>
            подписки: <span className={styles.statValue}>{stats.following}</span>
          </div>
        </div>
        <div className={styles.name}>{fullName}</div>
      </div>
    </div>
  );
};

export default ProfileInfo;