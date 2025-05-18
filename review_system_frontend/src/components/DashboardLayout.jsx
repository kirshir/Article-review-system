import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { getUserRole } from '../utils/auth';
import AuthContext from '../context/AuthContext';
import ProfilePage from './ProfilePage';
import '../assets/DashboardLayout.css';

//компоненты для Author
import ArticleList from './author/ArticleList';
import ArticleUpload from './author/ArticleUpload';
import ArticleReview from './author/ArticleReview';

//Компоненты для Admin
import UserManagement from './admin/UserManagement';
import ArticleManagement from './admin/ArticleManagement';

//Компоненты для рецензента
import AssignedArticlesPage from './reviewer/AssignedArticlesPage';
import CreateReviewPage from './reviewer/CreateReviewPage';
import MyReviewsPage from './reviewer/MyReviewsPage';

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
      { path: 'profile', label: 'Мой профиль' },
      { path: 'assigned-articles', label: 'Статьи для рецензирования' },
      { path: 'my-reviews', label: 'Мои рецензии' },
    ],
    Admin: [
      { path: 'profile', label: 'Мой профиль' },
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
          <Route path="profile" element={<ProfilePage />} />
          {/*Маршруты для автора*/}
          <Route path="my-articles" element={<ArticleList />} />
          <Route path="upload-article" element={<ArticleUpload />} />
          <Route path="article/:id/review" element={<ArticleReview />} />
          {/*Маршруты для рецензента*/}
          <Route path="assigned-articles" element={<AssignedArticlesPage />} />
          <Route path="create-review/:articleId" element={<CreateReviewPage />} />
          <Route path="my-reviews" element={<MyReviewsPage />} />
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