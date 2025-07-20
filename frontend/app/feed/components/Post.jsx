"use client";
import React, { useEffect, useState } from "react";
import styles from "../styles/Post.module.css";
import postStyles from "./Post.module.css";

export const Post = ({
  comments,
  nickname,
  likes,
  description,
  commentCount,
  timeAgo,
  photo_url,
  id,
  avatar
}) => {
  const [showComments, setShowComments] = useState(false);


  return (
    <article className={styles.post}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          {avatar && <img src={avatar} alt="User Avatar" className={styles.avatar} />}
          <div className={styles.username}>{nickname}</div>
        </div>
      </div>
      <div className={styles.divider} />
      <div className={postStyles.postImageContainer} role="img" aria-label="Post content">
        <img src={photo_url} alt="Post content" className={postStyles.postImage} />
      </div>
      <div className={styles.content}>
        <div className={styles.interactions}>
          <div className={styles.navIconsContainer}>
            <div className={styles.navIonsContainerLeft}>
              <img loading="lazy" src='./favorite.png' className={styles.navIcons} alt="Navigation icons" />
              <img loading="lazy" src='./speech-balloon.png' className={styles.navIcons} alt="Navigation icons" />
              <img loading="lazy" src='./send.png' className={styles.navIcons} alt="Navigation icons" />
            </div>
            <div className={styles.navIonsContainerRight}>
              <img loading="lazy" src='./bookmark.png' className={styles.navIcons} alt="Navigation icons" />
            </div>
          </div>
          <div className={styles.likes}>{likes} лайк</div>
          <div className={styles.description}><span className={styles.username}>{nickname}</span> {description}</div>
          {showComments && (
            <div className={styles.commentsSection}>
              {comments.map(comment => {
                return (
                  <div key={comment.id} className={styles.comment}>
                    <span className={styles.username}>{comment.commenter}</span>: {comment.body}
                  </div>
                );
              })}
            </div>
          )}
          <button 
            className={styles.seeComments} 
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? 'Скрыть' : 'Показать'}  комментарии ({commentCount})
          </button>
          <div className={styles.timeAgo}>{timeAgo}</div>
        </div>
      </div>
      <form className={styles.actions} onSubmit={async (e) => {
        e.preventDefault();
        const comment = e.target.commentInput.value;
        const requestBody = {
          comment: {
            body: comment,
            commenter: nickname
          }
        };
        console.log('Sending Request Body:', JSON.stringify(requestBody));
        if (!comment) {
          return;
        }
        
        try {
          const response = await fetch(`http://localhost:3001/api/articles/${id}/comments`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
          
          if (response.ok) {
            e.target.commentInput.value = ''; 
            window.location.reload(); 
          }
        } catch (error) {
          console.error('Error posting comment:', error);
        }
      }}>
        <div className={styles.commentSection}>
          <img loading="lazy" src='./smile.png' className={styles.navIcons} alt="Navigation icons" />
          <input 
            id="commentInput" 
            className={styles.commentInput} 
            type="text" 
            placeholder="Написать комментарий..." 
            aria-label="Add a comment" 
            name="commentInput"
          />
        </div>
        <button type="submit" className={styles.postButton}>ОК</button>
      </form>
    </article>
  );
};
