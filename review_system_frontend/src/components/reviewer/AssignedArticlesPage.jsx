import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import '../../assets/Reviewer.css';

const AssignedArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            const fetchAssignedArticles = async () => {
            try {
                const response = await fetch('http://localhost:5006/api/articles', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке статей');
                }
                
                const data = await response.json();
                setArticles(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
            };
            fetchAssignedArticles();
        } else {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleDecline = async (articleId) => {
        try {
            // Отправляем запрос на сервер об отказе
            const response = await fetch(`http://localhost:5006/api/reviews/${articleId}/decline`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Не удалось отказаться от рецензирования');
            }
            
            // Обновляем локальное состояние - удаляем статью из списка
            setArticles(prev => prev.filter(article => article.id !== articleId));
            
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDownload = async (articleId) => {
        try {
            const response = await fetch(`http://localhost:5006/api/articles/${articleId}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Ошибка при скачивании статьи');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `article_${articleId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError(err.message);
        }
    };
    
    if (isLoading) {
        return <div className="reviewer-container">Загрузка...</div>;
    }


    return (
        <div className="reviewer-container">
            <div className="review-section">
                <h1 className="review-title">Статьи для рецензирования</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                {articles.length === 0 ? (
                    <p>Нет доступных статей для рецензирования</p>
                ) : (
                    <div className="article-list">
                        {articles.map(article => (
                            <div key={article.id} className="article-card">
                                <div className="article-info">
                                    <div className="article-name">{article.title}</div>
                                    <div className="article-meta">
                                        Автор: {article.authorName} | 
                                        Дата подачи: {new Date(article.submissionDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleDownload(article.id)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Скачать
                                    </button>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/dashboard/create-review/${article.id}`)}
                                    >
                                        Рецензировать
                                    </button>
                                    <button 
                                        className="btn btn-danger"
                                        onClick={() => handleDecline(article.id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Отказаться
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignedArticlesPage;
