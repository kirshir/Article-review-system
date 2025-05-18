import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import '../../assets/Articles.css';

const ArticleManagement = () => {
    const { token } = useContext(AuthContext);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusMap = {
        0: 'Pending',
        1: 'Accepted',
        2: 'Rejected',
    };

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`${BASE_URL}/articles`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Ошибка загрузки статей');
                const data = await response.json();
                setArticles([...data].sort((a, b) => a.id - b.id));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [token]);

    const deleteArticle = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/articles/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Ошибка удаления статьи');
            setArticles(articles.filter(article => article.id !== id));
            toast.success('Статья удалена');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const downloadArticle = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/articles/${id}/download`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Ошибка скачивания статьи');

            // Извлекаем имя файла из Content-Disposition
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
            toast.error(error.message);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="articles-container">
            <h2>Управление статьями</h2>
            {articles.length === 0 ? (
                <p>Нет статей для отображения</p>
            ) : (
                <table className="articles-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Название</th>
                            <th>Автор</th>
                            <th>Дата подачи</th>
                            <th>Статус</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(article => (
                            <tr key={article.id}>
                                <td>{article.id}</td>
                                <td>{article.title}</td>
                                <td>{article.authorName}</td>
                                <td>{new Date(article.submissionDate).toLocaleDateString()}</td>
                                <td>{statusMap[article.status] || 'Неизвестно'}</td>
                                <td>
                                    <button
                                        onClick={() => downloadArticle(article.id)}
                                        className="articles-button download-button"
                                    >
                                        Скачать
                                    </button>
                                    <button
                                        onClick={() => deleteArticle(article.id)}
                                        className="articles-button delete-button"
                                    >
                                        Удалить
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

export default ArticleManagement;