'use client';
import React, { useEffect, useState } from "react";
import { Post } from "./components/Post";
import { Sidebar } from "./components/Sidebar";
import styles from "./Feed.module.css";
import { Header } from "./components/Header";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userResponse = await fetch("http://localhost:3001/api/sessions/current", {
          method: "GET",
          credentials: 'include',
      });
      if (!userResponse.ok) {
          return;
      }
      const userData = await userResponse.json();
      setNickname(userData.nickname);
    };

    const fetchPosts = async () => {
      const response = await fetch("http://localhost:3001/api/articles", {
        method: "GET",
      });
      const data = await response.json();
      const postsWithFullUrls = data.map(post => ({
        ...post,
        user_photo_url: post.user_photo_url && post.user_photo_url.startsWith('http') ? post.user_photo_url : `http://localhost:3001/${post.user_photo_url || '/default.jpg'}`,
        photo_url: post.photo_url && post.photo_url.startsWith('http') ? post.photo_url : `http://localhost:3001/${post.photo_url || ''}`
      })).reverse();
      setPosts(postsWithFullUrls);
    };
    fetchPosts();
    fetchUser();
  }, []);

  return (
    <div className={styles.feed}>
      <Header nickname={nickname} />
      <main className={styles.mainContent}>
        <div className={styles.contentGrid}>
          <div className={styles.feedColumn}>
            {posts.map((post) => (
              <Post
                avatar={post.user_photo_url || '/default.jpg'}
                key={post.id}
                id={post.id}
                title={post.title}
                photo_url={post.photo_url}
                nickname={post.user.nickname}
                likes={post.likes} 
                description={post.body}
                commentCount={post.comments.length}
                timeAgo={post.timeAgo}
                comments={post.comments}
              />
            ))}
          </div>
          <div className={styles.sidebarColumn}>
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
};
