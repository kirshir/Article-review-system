import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { fetchArticleReview } from '../../utils/auth';

const ArticleStatus = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReview = async () => {
      try {
        const data = await fetchArticleReview(token, id);
        setReview(data);
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReview();
  }, [token, id]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="review-container">
      <h2>Рецензия на статью</h2>
      {review ? (
        <>
          <div className="review-info">
            <p><strong>Рецензент:</strong> {review.reviewerName}</p>
            <p><strong>Дата рецензии:</strong> {new Date(review.reviewDate).toLocaleDateString()}</p>
            <p><strong>Статус:</strong> {review.status === 1 ? 'Принято' : 'Отклонено'}</p>
          </div>
          <div className="review-text">
            <h3>Текст рецензии:</h3>
            <p>{review.reviewText}</p>
          </div>
        </>
      ) : (
        <p>Рецензия еще не предоставлена</p>
      )}
    </div>
  );
};

export default ArticleStatus;