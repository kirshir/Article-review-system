import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../assets/ProfilePage.css';

const ProfilePage = () => {
  const { user, loading } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    specialization: '',
    location: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        fullName: user.fullName || '',
        specialization: user.specialization || '',
        location: user.location || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5006/api/users/${user.username}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          specialization: formData.specialization,
          location: formData.location,
        }),
      });
      if (!response.ok) throw new Error('Ошибка обновления данных');
      const data = await response.json();
      setMessage({ text: data.message || 'Профиль успешно обновлен!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 1000);
    } catch (error) {
      setMessage({ text: 'Ошибка при обновлении профиля', type: 'error' });
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="profile-container">
      <h1>Личный кабинет</h1>
      <div className="profile-card">
        <div className="profile-info">
          <p><strong>Username:</strong> {user?.username || 'Не указан'}</p>
          <p><strong>Роль:</strong> {user?.role || 'Не указана'}</p>
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Полное имя:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Специализация:</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Местоположение:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <button type="submit" className="save-button">Сохранить изменения</button>
          {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;