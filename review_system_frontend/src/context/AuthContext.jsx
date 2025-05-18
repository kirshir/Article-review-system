import { createContext, useState, useEffect } from 'react';

//Создаем контекст для управления состоянием авторизации
const AuthContext = createContext();

//провайдер контекста
export const AuthProvider = ({ children }) => {
  // Состояние для хранения токена
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Слушаем изменения в localStorage 
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      setToken(newToken); 
    };

    //добавляем слушатель события storage(срабатывает при изменении localStorage)
    window.addEventListener('storage', handleStorageChange);

    handleStorageChange();

    // Удаляем слушатель 
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const setAuthToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token'); 
    }
    setToken(newToken); 
  };

  return (
    <AuthContext.Provider value={{ token, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;