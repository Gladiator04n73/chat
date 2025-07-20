'use client';
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../providers/AuthProvider";
import styles from "../styles/PhotoGrid.module.css";

const PhotoGrid = ({ articles, setArticles }) => {
  const { user } = useAuth();
  console.log("Current user:", user);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleDelete = async (id) => {
    if (user.id !== article.user.id) {
        alert("Вы не можете удалить чужие посты.");
        return;
    }
    const confirmDelete = window.confirm("Вы уверены, что хотите удалить этот пост?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/api/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error deleting article:', errorText);
        return;
      }
      setIsFormVisible(false);
      setArticles((prevArticles) => prevArticles.filter(article => article.id !== id));
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleArticleClick = async (article) => {
    try {
      const photoResponse = await fetch(`http://localhost:3001/api/articles/${article.id}`);
      if (!photoResponse.ok) {
        const errorText = await photoResponse.text();
        console.error('Error fetching photo data:', errorText);
        return;
      }
      const photoData = await photoResponse.json();
      const photoUrl = photoData.url;
      setSelectedArticle(article);

      const commentsResponse = await fetch(`http://localhost:3001/api/articles/${article.id}/comments`);

      if (!commentsResponse.ok) {
        const errorText = await commentsResponse.text();
        console.error('Error fetching comments:', errorText);
        return;
      }

      const data = await commentsResponse.json();
      setComments(data);
      setIsFormVisible(true);
    } catch (error) {
      console.error('Error fetching article data:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log("Comment submission initiated.");

    if (!user) {
        console.error("User must be logged in to comment.");
        return;
    }
    if (newComment.trim()) {
      try {
        const response = await fetch(`http://localhost:3001/api/articles/${selectedArticle.id}/comments`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: newComment }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error submitting comment:', errorText);
          return;
        }
        const commentData = await response.json();
        setComments([...comments, { commenter: user.nickname, body: commentData.body }]);
        setNewComment('');
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  };

  return (
    <div className={styles.photoGrid}>
      {articles.length > 0 ? articles.map((article, index) => (
        <div key={index} className={`${styles.photoItem}`} onClick={() => handleArticleClick(article)} >
          <img 
            src={article.photo_url.startsWith('http') ? article.photo_url : `http://localhost:3001${article.photo_url}`} 
            alt={article.title} 
            className={styles.photoImage} 
            onError={() => console.error('Error loading image:', article.photo_url)} 
          />
        </div>
      )) : <div>Нет доступных статей.</div>}
      {isFormVisible && selectedArticle && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div className={styles.leftColumn}>
              <span className={styles.closeIcon} onClick={() => setIsFormVisible(false)}>&times;</span>
              {user.id === selectedArticle.user.id && (
                <button onClick={() => handleDelete(selectedArticle.id)} className={styles.deleteButton}>Удалить</button>
              )}

              {selectedArticle && (
                <img 
                  src={selectedArticle.photo_url && selectedArticle.photo_url.startsWith('http') ? selectedArticle.photo_url : `http://localhost:3001${selectedArticle.photo_url}`} 
                  alt={selectedArticle.title} 
                  className={styles.photoImage} 
                  onError={() => {
                    console.error('Error loading image:', selectedArticle.photo_url);
                  }} 
                />
              )}
              <div className={styles.postDetails}>
                <div className={styles.description}>
                  <span className={styles.username}>{selectedArticle.user.nickname}</span> {selectedArticle.body}
                </div>
              </div>
            </div>
            <div className={styles.rightColumn}>
              <div className={styles.commentsSection}>
                {Array.isArray(comments) && comments.map((comment, index) => (
                  <div key={index} className={styles.comment}>
                    <span className={styles.commentAuthor}>{comment.commenter}</span> {comment.body}
                  </div>
                ))}
              </div>
              <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Написать комментарий..."
                  className={styles.commentInput}
                />
                <button type="submit" className={styles.commentButton}>Опубликовать</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
