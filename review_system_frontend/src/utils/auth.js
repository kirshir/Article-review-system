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
