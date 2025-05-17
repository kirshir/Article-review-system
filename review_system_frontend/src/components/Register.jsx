import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BASE_URL } from '../config'; 
import '../assets/Register.css';

const Register = () => {
    const navigate = useNavigate();
    
    const handleRegister = async (e) => {
        e.preventDefault();

        const username = e.target.elements.username.value;
        const password = e.target.elements.password.value;
        const email = e.target.elements.email.value;
        const fullName = e.target.elements.fullName.value;
        const specialization = e.target.elements.specialization.value;
        const location = e.target.elements.location.value;
        const role = parseInt(e.target.elements.role.value, 10);

        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email, fullName, specialization, location, role }),
            });

            if (!response.ok) {
                throw new Error('Ошибка регистрации');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token); 
            toast.success('Регистрация успешна!');
            navigate('/dashboard'); 
        } catch(error) {
            toast.error(error.message);
        }

    };

    return (
        <div className="register-container">
            <form onSubmit={handleRegister} className="register-form">
                <h2>Регистрация</h2>
                <input type="text" name="username" placeholder="Username" className="register-input" />
                <input type="password" name="password" placeholder="Password" className="register-input" />
                <input type="email" name="email" placeholder="Email" className="register-input" />
                <input type="text" name="fullName" placeholder="Full Name" className="register-input" />
                <input type="text" name="specialization" placeholder="Specialization" className="register-input" />
                <input type="text" name="location" placeholder="Location" className="register-input" />
                <select name="role" className="register-input">
                    <option value="0">Author</option>
                    <option value="1">Reviewer</option>
                </select>
                <button type="submit" className="register-button">Зарегистрироваться</button>
                <p className="register-text">
                    Уже есть аккаунт? <button type="button" onClick={() => navigate('/login')} className="register-link">Войти</button>
                </p>
            </form>
        </div>
    );
};

export default Register;