import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { BASE_URL } from '../config';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import '../assets/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { setAuthToken } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password}),
            });

            if (!response.ok) {
                throw new Error("Неверные данные для входа");
            }

            const data = await response.json();
            setAuthToken(data.token, username);
            toast.success('Вход выполнен успешно!');
            navigate('/dashboard');
        } catch(error) {
            toast.error(error.message);
        }
    };

    return (
    <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
            <h2>Вход</h2>
            <input
                type="text"
                name="username" 
                placeholder="Username"
                className="login-input"
            />
            <input
                type="password"
                name="password" 
                placeholder="Password"
                className="login-input"
            />
            <button type="submit" className="login-button">Войти</button>
            <p className="login-text">
                Нет аккаунта? <button type="button" onClick={() => navigate('/register')} className="login-link">Зарегистрироваться</button>
            </p>
        </form>
    </div>
  );
};

export default Login;