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

    // const fetchAssignedArticles = async () => {
    //     try {
    //         const response = await fetch('http://localhost:5006/api/articles', {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         });
            
    //         if (!response.ok) {
    //             throw new Error('Ошибка при загрузке статей');
    //         }
            
    //         const data = await response.json();
    //         // Загружаем список отклоненных статей из localStorage
    //         const declinedArticles = JSON.parse(localStorage.getItem('declinedArticles') || '[]');
            
    //         // Фильтруем статьи: оставляем только те, которые не отклонены и не в процессе рецензирования
    //         const filteredArticles = data.filter(article => 
    //             !declinedArticles.includes(article.id)
    //         );

    //         // // Помечаем отклоненные статьи
    //         // const articlesWithStatus = data.map(article => ({
    //         //     ...article,
    //         //     declined: declinedArticles.includes(article.id)
    //         // }));

    //         setArticles(filteredArticles);
    //     } catch (err) {
    //         setError(err.message);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

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
                    // Загружаем список отклоненных статей из localStorage
                    const declinedArticles = JSON.parse(localStorage.getItem('declinedArticles') || '[]');
                    
                    // Фильтруем статьи: оставляем только те, которые не отклонены и не в процессе рецензирования
                    const filteredArticles = data.filter(article => 
                        !declinedArticles.includes(article.id)
                    );

                    // // Помечаем отклоненные статьи
                    // const articlesWithStatus = data.map(article => ({
                    //     ...article,
                    //     declined: declinedArticles.includes(article.id)
                    // }));

                    setArticles(filteredArticles);
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
            // Сохраняем ID отклоненной статьи в localStorage
            const declinedArticles = JSON.parse(localStorage.getItem('declinedArticles') || []);
            if (!declinedArticles.includes(articleId)) {
                declinedArticles.push(articleId);
                localStorage.setItem('declinedArticles', JSON.stringify(declinedArticles));
            }
            
            // Помечаем статью как отклоненную в состоянии
            setArticles(prevArticles => 
                prevArticles.map(article => 
                    article.id === articleId 
                        ? { ...article, declined: true } 
                        : article
                )
            );
            
            // Отправляем запрос на сервер об отказе
            await fetch(`http://localhost:5006/api/reviews/${articleId}/decline`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
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
                            <div 
                                key={article.id} 
                                className={`article-card ${article.declined ? 'declined-article' : ''}`}
                            >
                                <div className="article-info">
                                    <div className="article-name">{article.title}</div>
                                    <div className="article-meta">
                                        Автор: {article.authorName} | 
                                        Дата подачи: {new Date(article.submissionDate).toLocaleDateString()}
                                        {article.declined && <span className="declined-label"> (Отказано)</span>}
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
                                    {!article.declined && (
                                        <>
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
                                        </>
                                    )}
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