import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import '../../assets/Reviewer.css';

const MyReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();


    useEffect(() => {
        if (token) {
            const fetchMyReviews = async () => {
                try {
                    const response = await fetch('http://localhost:5006/api/reviews/my-reviews', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error('Ошибка при загрузке рецензий');
                    }
                    
                    const data = await response.json();
                    setReviews(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchMyReviews();
        } else {
            navigate('/login');
        }
    }, [token, navigate]);

    if (isLoading) {
        return <div className="reviewer-container">Загрузка...</div>;
    }

    return (
        <div className="reviewer-container">
            <div className="review-section">
                <h1 className="review-title">Мои рецензии</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                {reviews.length === 0 ? (
                    <p>У вас пока нет отправленных рецензий</p>
                ) : (
                    <div className="reviews-history">
                        {reviews.map(review => (
                            <div key={review.id} className="review-item">
                                <div className={`review-status ${
                                    review.status === 0 ? 'status-accepted' : 
                                    review.status === 1 ? 'status-rejected' : 'status-revision'
                                }`}>
                                    {review.status === 0 ? 'Принято' : 
                                     review.status === 1 ? 'Отклонено' : 'На доработке'}
                                </div>
                                <h3>{review.articleTitle}</h3>
                                <p>{review.reviewText}</p>
                                <div className="review-meta">
                                    Дата рецензии: {new Date(review.reviewDate).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyReviewsPage;