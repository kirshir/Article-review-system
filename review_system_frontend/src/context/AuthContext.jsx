import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      setToken(newToken);
      if (newToken) {
        fetchUserData(newToken);
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchUserData = async (authToken) => {
    try {
      const username = localStorage.getItem('username');
      if (!username) {
        console.error('Username не найден в localStorage');
        setUser(null);
        return;
      }

      const response = await fetch(`http://localhost:5006/api/users/${username}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser({
          ...data,
          token: authToken,
        });
      } else {
        console.error('Ошибка API:', await response.text());
        setUser(null);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const setAuthToken = (newToken, username) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      if (username) localStorage.setItem('username', username); 
      fetchUserData(newToken);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setUser(null);
    }
    setToken(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuthToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;