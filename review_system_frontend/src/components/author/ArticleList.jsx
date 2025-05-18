import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { fetchMyArticles } from '../../utils/auth';

const ArticleList = () => {
  const { token } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchMyArticles(token);
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, [token]);

  const getStatusText = (status) => {
    switch (status) {
      case 0: return 'Ожидает рецензии';
      case 1: return 'Принято';
      case 2: return 'Отклонено';
      default: return 'Неизвестно';
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="article-list">
      <h2>Мои статьи</h2>
      <Link to="/dashboard/upload-article" className="upload-link">
        Загрузить новую статью
      </Link>
      {articles.length === 0 ? (
        <p>У вас нет отправленных статей</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Дата отправки</th>
              <th>Статус</th>
              <th>Рецензия</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{new Date(article.submissionDate).toLocaleDateString()}</td>
                <td>{getStatusText(article.status)}</td>
                <td>
                  {article.review ? (
                    <Link to={`/dashboard/article/${article.id}/review`}>
                      Просмотреть
                    </Link>
                  ) : (
                    'Нет рецензии'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ArticleList;