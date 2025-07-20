'use client';
import React, { Suspense } from "react";
import { Header } from "./components/Header";
import ProfileInfo from "./components/ProfileInfo";
import PhotoGrid from "./components/PhotoGrid";
import styles from "./styles/Profile.module.css";

export default function Profile({ params: paramsPromise }) {
  const params = React.use(paramsPromise);
  const [profileData, setProfileData] = React.useState(null);
  const [posts, setPosts] = React.useState([]);
  const [error, setError] = React.useState(null);

  console.log('Fetching profile for user ID:', params.id);

  React.useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/users/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch profile data');
        const data = await response.json().catch(err => {
          console.error('Failed to parse JSON:', err);
          setError('Unexpected response format from server.');
        });
        console.log('Profile data fetched:', data);
        setProfileData({
          ...data,
          is_following: data.is_following !== undefined ? data.is_following : false,
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Не удалось загрузить данные профиля.');
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/articles/user_articles?user_id=${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        console.log('Posts fetched for user ID:', params.id, data);
        setPosts(data.reverse());
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Не удалось загрузить посты.');
      }
    };

    fetchProfileData();
    fetchPosts();
  }, [params.id]);

  if (error) return <div>{error}</div>;
  if (!profileData) return <div></div>;

  console.log('Profile data fetched:', profileData);
  const profileStats = {
    profilePicture: profileData.profile_picture,
    following: profileData.is_following,
    username: profileData.nickname,
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

  return (<Suspense fallback={<div>Loading profile...</div>}>
      <div>
        <Header  username={profileData.nickname} />
        <div className={styles.profile}>
          <ProfileInfo
            updateStats={(change) => {
              setProfileData((prevData) => ({
                ...prevData,
                followers_count: prevData.followers_count + change,
              }));
            }}
            username={profileData.nickname}
            stats={profileStats}
            fullName={profileData.name}
            userId={params.id}
            isFollowing={profileData.is_following}
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
    </Suspense>
  );
}
