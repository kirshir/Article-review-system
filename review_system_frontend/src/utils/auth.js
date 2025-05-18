import { jwtDecode } from 'jwt-decode'; 

// Функция для получения роли пользователя из токена
export const getUserRole = (token) => {
    if (!token) return null; 

    try {
        const decoded = jwtDecode(token); // Декодируем токен
        return (
            decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            decoded.role || null
        );
    } catch (error) {
        console.error('Ошибка декодирования токена:', error);
        return null;
    }
};

export const fetchMyArticles = async (token) => {
    const response = await fetch('http://localhost:5006/api/articles/my-articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch articles');
    return await response.json();
  };
  
  export const uploadArticle = async (token, formData) => {
    const response = await fetch('http://localhost:5006/api/articles/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload article');
    return await response.json();
  };
  
  export const fetchArticleReview = async (token, articleId) => {
    const response = await fetch('http://localhost:5006/api/articles/my-articles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch review');
    const articles = await response.json();
    const article = articles.find(a => a.id === parseInt(articleId));
    return article?.review || null;
  };
  
  // export const loginUser = async (username, password) => {
  //   const response = await fetch('http://localhost:5006/api/auth/login', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ username, password }),
  //   });
    
  //   const data = await response.json();
  //   if (!response.ok) throw new Error(data.message || 'Login failed');
    
  //   return { 
  //     token: data.token, 
  //     username // Возвращаем имя пользователя из входа
  //   };
  // };
  
  // Обновление информации о пользователе
  export const updateUserInfo = async (username, updatedData) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`http://localhost:5006/api/users/${username}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user info');
    }

    return await response.json();
  };
  
