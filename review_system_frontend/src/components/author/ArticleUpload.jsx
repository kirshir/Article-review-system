import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import '../../assets/ArticleUpload.css';

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
      const response = await fetch('http://localhost:5006/api/articles/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Ошибка при загрузке статьи');
      await response.json();
      setMessage('Статья успешно загружена');
      setTimeout(() => navigate('/dashboard/my-articles'), 1000);
    } catch (error) {
      setMessage('Ошибка при загрузке статьи');
    }
  };

  return (
    <div className="upload-container">
      <h2>Загрузка статьи</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Название статьи:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Файл статьи (PDF/DOCX):</label>
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            required
            className="form-input file-input"
          />
        </div>
        <button type="submit" className="submit-button">Отправить на рецензию</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ArticleUpload;