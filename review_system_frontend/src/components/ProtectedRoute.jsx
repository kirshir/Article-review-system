import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext'; 

const ProtectedRoute = ({children}) => {
    const { token } = useContext(AuthContext); //получаем токен из контекста
    console.log('Токен в ProtectedRoute:', token); 

    if (!token) {
        return <Navigate to='/login' />;
    }
    return children;
};

export default ProtectedRoute;