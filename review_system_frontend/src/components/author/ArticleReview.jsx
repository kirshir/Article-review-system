import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import '../../assets/ArticleReview.css';

const ArticleReview = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReview = async () => {
      try {
        const response = await fetch(`http://localhost:5006/api/articles/my-articles`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Ошибка загрузки рецензии');
        const articles = await response.json();
        const article = articles.find(a => a.id === parseInt(id));
        setReview(article?.review || null);
      } catch (error) {
        console.error('Ошибка загрузки рецензии:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReview();
  }, [token, id]);

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Принято';
      case 1: return 'Отклонено';
      default: return 'Не определено';
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="review-container">
      <h2>Рецензия на статью</h2>
      <Link to="/dashboard/my-articles" className="back-button">
        Вернуться к статьям
      </Link>
      {review ? (
        <div className="review-card">
          <div className="review-info">
            <p><strong>Рецензент:</strong> {review.reviewerName}</p>
            <p><strong>Дата рецензии:</strong> {new Date(review.reviewDate).toLocaleDateString()}</p>
            <p><strong>Статус:</strong> {getStatusText(review.status)}</p>
          </div>
          <div className="review-text">
            <h3>Текст рецензии:</h3>
            <p>{review.reviewText || 'Текст рецензии отсутствует'}</p>
          </div>
        </div>
      ) : (
        <p>Рецензия еще не предоставлена</p>
      )}
    </div>
  );
};

export default ArticleReview;