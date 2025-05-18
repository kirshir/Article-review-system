import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { getUserRole } from '../utils/auth';
import AuthContext from '../context/AuthContext';
import '../assets/DashboardLayout.css';
import AuthorProfile from './author/AuthorProfile';
import ArticleList from './author/ArticleList';
import ArticleUpload from './author/ArticleUpload';
import ArticleStatus from './author/ArticleStatus';

// Компоненты для Admin
import UserManagement from './admin/UserManagement';
import ArticleManagement from './admin/ArticleManagement';

//основной layout для авторизованных пользователей
const DashboardLayout = () => {
  const navigate = useNavigate();
  const { token, setAuthToken } = useContext(AuthContext); //получаем токен и setAuthToken из контекста
  const [role, setRole] = useState(null); //состояние для хранения роли пользователя

  useEffect(() => {
    const userRole = getUserRole(token);
    setRole(userRole);
    if (!userRole) {
      navigate('/login');
    }
  }, [navigate, token]);

  const handleLogout = () => {
    setAuthToken(null); //удаляем токен через контекст
    navigate('/login');
  };

  //ссылки для навигации в зависимости от роли
  const navLinks = {
    Author: [
      { path: 'profile', label: 'Мой профиль' },
      { path: 'my-articles', label: 'Мои статьи' },
      { path: 'upload-article', label: 'Загрузить статью' },
    ],
    Reviewer: [
      { path: 'assigned-articles', label: 'Назначенные статьи' },
    ],
    Admin: [
      { path: 'user-management', label: 'Управление пользователями' },
      { path: 'article-management', label: 'Управление статьями' }, 
    ],
  };

  return (
    <div className="dashboard-container">
      {/*боковая панель*/}
      <div className="sidebar">
        <h2 className="sidebar-title">Навигация</h2>
        <ul className="sidebar-list">
          {/* показываем ссылки в зависимости от роли */}
          {role && navLinks[role] && navLinks[role].map((link) => (
            <li key={link.path}>
              <button
                className="sidebar-link"
                onClick={() => navigate(`/dashboard/${link.path}`)}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
        {/*кнопка выхода*/}
        <button className="logout-button" onClick={handleLogout}>
          Выйти
        </button>
      </div>

      {/*основной контент*/}
      <div className="content">
        <Routes>
          {/*вложенные маршруты для dashboard */}
          {/*Маршруты для автора*/}
          {/* <Route path="my-articles" element={<MyArticles />} /> */}
          <Route path="my-articles" element={<ArticleList />} />
          <Route path="upload-article" element={<ArticleUpload />} />
          <Route path="profile" element={<AuthorProfile />} />
          <Route path="article/:id/review" element={<ArticleStatus />} />
          {/*Маршруты для рецензента*/}
          {/* <Route path="assigned-articles" element={<AssignedArticles />} /> */}
          {/*Маршруты для админа*/}
          <Route path="user-management" element={<UserManagement />} />
          <Route path="article-management" element={<ArticleManagement />} />
          {/*пустой марширут*/}
          <Route path="*" element={<div>Выберите раздел в меню</div>} />
        </Routes>
      </div>
    </div>  
  );
};

export default DashboardLayout;