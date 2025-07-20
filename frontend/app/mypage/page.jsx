'use client';
import React from "react";
import { useRouter } from 'next/navigation';
import { Header } from "./components/Header";
import ProfileInfo from "./components/ProfileInfo";
import PhotoGrid from "./components/PhotoGrid";
import { checkSession } from "../utils/api";
import styles from "./styles/Profile.module.css";

export default function Profile() {
  const [profileData, setProfileData] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [error, setError] = React.useState(null);

  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      const userData = await checkSession();
      if (!userData) {
        router.push('/auth');
        return;
      }

      try {
        const profileResponse = await fetch(`http://localhost:3001/api/users/${userData.id}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!profileResponse.ok) throw new Error('Failed to fetch profile data');
        const profileData = await profileResponse.json();
        console.log('Profile data fetched:', profileData);
        setProfileData(profileData);

        const postsResponse = await fetch(`http://localhost:3001/api/articles/user_articles?user_id=${userData.id}`);
        if (!postsResponse.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsResponse.json();
        console.log('Posts fetched for user ID:', userData.id, postsData);
        setPosts(postsData.reverse());
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Не удалось загрузить данные профиля или посты.');
      }
    };

    fetchData();
  }, []);

  if (error) return <div>{error}</div>;
  if (!profileData) return <div></div>;

  console.log('Profile data fetched:', profileData);
  const profileStats = {
    posts: posts.length,
    followers: profileData.followers_count || 0,
    following: profileData.following_count || 0,
  };

  const photos = posts.map(post => {
    return {
      url: post.photo_url.startsWith('http') ? post.photo_url : `http://localhost:3001${post.photo_url}`,
      description: post.title
    };
  });

  const setArticles = (newArticles) => {
    setPosts(newArticles);
  };

  return (
    <div>
      <Header />
      <div className={styles.profile}>
        <ProfileInfo
          username={profileData.nickname}
          stats={profileStats}
          fullName={profileData.name}
          photo={profileData.photo}
        />
        <div className={styles.divider} />
        <div className={styles.tabIndicator} />
        <div className={styles.postsTab}>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f43de0ce7b2f2dc66800f1a3dbd86bbc96011c229fa2de1c47beefae4b6a621?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
            alt=""
            className={styles.postsIcon}
          />
          <span>ПОСТЫ</span>
        </div>
        <div className={styles.gridContainer}>
          <PhotoGrid articles={posts} setArticles={setArticles} className={posts.length === 1 ? styles.fullWidth : ''} />
        </div>
      </div>
    </div>
  );
}
