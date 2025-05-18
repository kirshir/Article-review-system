import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { getUserRole } from '../utils/auth';
import AuthContext from '../context/AuthContext';
import '../assets/DashboardLayout.css';

// Заглушки для страниц (доделать позже)
const MyArticles = () => <div>Мои статьи (для Author)</div>;
const AssignedArticles = () => <div>Назначенные статьи (для Reviewer)</div>;
const AdminPanel = () => <div>Панель администратора (для Admin)</div>;

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
      { path: 'my-articles', label: 'Мои статьи' },
    ],
    Reviewer: [
      { path: 'assigned-articles', label: 'Назначенные статьи' },
    ],
    Admin: [
      { path: 'admin-panel', label: 'Панель администратора' },
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
          <Route path="my-articles" element={<MyArticles />} />
          {/*Маршруты для рецензента*/}
          <Route path="assigned-articles" element={<AssignedArticles />} />
          {/*Маршруты для админа*/}
          <Route path="admin-panel" element={<AdminPanel />} />
          {/*пустой марширут*/}
          <Route path="*" element={<div>Выберите раздел в меню</div>} />
        </Routes>
      </div>
    </div>  
  );
};

export default DashboardLayout;