import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import '../../assets/Reviewer.css';

const CreateReviewPage = () => {
    const { articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [status, setStatus] = useState('1');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                // Загружаем список всех статей
                const response = await fetch('http://localhost:5006/api/articles', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке статей');
                }
                
                const articles = await response.json();
                // Ищем нужную статью по ID
                const foundArticle = articles.find(a => a.id.toString() === articleId);
                
                if (!foundArticle) {
                    throw new Error('Статья не найдена');
                }
                
                setArticle({
                    id: foundArticle.id,
                    title: foundArticle.title,
                    authorName: foundArticle.authorName,
                    submissionDate: foundArticle.submissionDate
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            fetchArticle();
        } else {
            navigate('/login');
        }
    }, [articleId, token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!reviewText.trim()) {
            setError('Пожалуйста, заполните текст рецензии');
            return;
        }
        
        try {
            // Определяем статус статьи на основе выбора
            let isApproved;
            if (status === '1') isApproved = true; // Принято
            else if (status === '2') isApproved = false; // Отклонено
            else if (status === '3') isApproved = false; // На доработку (тоже считается отклонением)
            
            const response = await fetch('http://localhost:5006/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    articleId: articleId,
                    reviewText: reviewText,
                    isApproved: isApproved
                })
            });
            
            if (!response.ok) {
                throw new Error('Ошибка при отправке рецензии');
            }


            // После успешной отправки:
            // 1. Удаляем статью из списка в родительском компоненте
            window.dispatchEvent(new CustomEvent('articleReviewed', { 
                detail: { articleId: parseInt(articleId) } 
            }));
            
            // 2. Перенаправляем на список рецензий
            navigate('/dashboard/my-reviews', {
                state: { message: 'Рецензия успешно отправлена' }
            });
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) {
        return <div className="reviewer-container">Загрузка статьи...</div>;
    }

    if (!article) {
        return (
            <div className="reviewer-container">
                <div className="error-message">
                    Статья не найдена. Возможно, она была удалена или у вас нет к ней доступа.
                    <button 
                        onClick={() => navigate('/dashboard/assigned-articles')}
                        style={{ marginLeft: '10px' }}
                        className="btn btn-secondary"
                    >
                        Вернуться к списку статей
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="reviewer-container">
            <div className="review-section">
                <h1 className="review-title">Создание рецензии</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                <div>
                    <h3>{article.title}</h3>
                    <p>Автор: {article.authorName}</p>
                    <p>Дата подачи: {new Date(article.submissionDate).toLocaleDateString()}</p>
                </div>
                
                <form className="review-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Статус рецензии:</label>
                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="1">Принято к публикации</option>
                            <option value="2">Отклонено</option>
                            <option value="3">Отправлено на доработку</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Текст рецензии:</label>
                        <textarea
                            className="form-textarea"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Подробно опишите ваше мнение о статье..."
                            required
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => navigate('/dashboard/assigned-articles')}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            Отправить рецензию
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateReviewPage;