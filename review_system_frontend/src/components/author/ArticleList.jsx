import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import '../../assets/ArticleList.css';

const ArticleList = () => {
  const { token } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetch('http://localhost:5006/api/articles/my-articles', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Ошибка загрузки статей');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Ошибка загрузки статей:', error);
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

  const downloadArticle = async (id) => {
    try {
      const response = await fetch(`http://localhost:5006/api/articles/${id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Ошибка скачивания статьи');

      let fileName = `article_${id}`;
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=(['"]?)(.*?)\1/);
        if (fileNameMatch && fileNameMatch[2]) {
          fileName = fileNameMatch[2];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Статья скачана');
    } catch (error) {
      console.error('Ошибка скачивания:', error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="article-list-container">
      <h2>Мои статьи</h2>
      {articles.length === 0 ? (
        <p>У вас нет отправленных статей</p>
      ) : (
        <table className="article-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Дата отправки</th>
              <th>Статус</th>
              <th>Рецензия</th>
              <th>Статья</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.id}</td>
                <td>{article.title}</td>
                <td>{new Date(article.submissionDate).toLocaleDateString()}</td>
                <td>{getStatusText(article.status)}</td>
                <td>
                  {article.review ? (
                    <Link to={`/dashboard/article/${article.id}/review`}>Просмотреть</Link>
                  ) : (
                    'Нет рецензии'
                  )}
                </td>
                <td>
                  <button
                    onClick={() => downloadArticle(article.id)}
                    className="download-button"
                  >
                    Скачать
                  </button>
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