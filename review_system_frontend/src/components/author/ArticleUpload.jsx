import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { uploadArticle } from '../../utils/auth';

const ArticleUpload = () => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage('Пожалуйста, заполните все поля');
      return;
    }

    const formData = new FormData();
    formData.append('Title', title);
    formData.append('File', file);

    try {
      await uploadArticle(token, formData);
      setMessage('Статья успешно загружена');
      setTimeout(() => navigate('/dashboard/my-articles'), 1500);
    } catch (error) {
      setMessage('Ошибка при загрузке статьи');
    }
  };

  return (
    <div className="upload-container">
      <h2>Загрузка статьи</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название статьи:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Файл статьи (PDF/DOCX):</label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Отправить на рецензию</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ArticleUpload;