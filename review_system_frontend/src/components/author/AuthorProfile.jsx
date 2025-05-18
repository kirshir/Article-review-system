import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { updateUserInfo } from '../../utils/auth';

const AuthorProfile = () => {
  const { user, isLoading, updateUser } = useContext(AuthContext); // Используем user и updateUser из контекста
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    specialization: '',
    location: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  // Заполняем форму данными пользователя при загрузке
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
      const updatedUser = await updateUserInfo(user.username, formData); // Передаем username и formData
      updateUser(updatedUser); // Обновляем данные пользователя в контексте
      setMessage({ text: 'Профиль успешно обновлен!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Ошибка при обновлении профиля', type: 'error' });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Мой профиль</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Username:</label>
          <input type="text" value={user?.username || ''} disabled />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Specialization:</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="save-btn">
          Save Changes
        </button>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}
      </form>
    </div>
  );
};

export default AuthorProfile;