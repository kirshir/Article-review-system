import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../../context/AuthContext';
import { BASE_URL } from '../../config';
import '../../assets/Admin.css'

const roleMap = {
    '0': 'Author',
    '1': 'Reviewer',
    '2': 'Admin'
};

const UserManagment = () => {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        email: '',
        fullName: '',
        specialization: '',
        location: '',
        role: '0'
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${BASE_URL}/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Ошибка загрузки пользователей');
                const data = await response.json();
                setUsers([...data].sort((a, b) => a.id - b.id));
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);

    const toggleBlockUser = async (username, isBlocked) => {
        try {
            const response = await fetch(`${BASE_URL}/users/block/${username}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isBlocked: !isBlocked }),
            });
            if (!response.ok) throw new Error('Ошибка изменения статуса блокировки');
            setUsers(users.map(user =>
                user.username === username ? { ...user, isBlocked: !isBlocked } : user
            ));
            toast.success(`Пользователь ${!isBlocked ? 'заблокирован' : 'разблокирован'}`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        try {
            const roleValue = parseInt(newUser.role, 10);
            const response = await fetch(`${BASE_URL}/users/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: newUser.username,
                    password: newUser.password,
                    email: newUser.email,
                    fullName: newUser.fullName || null,
                    specialization: newUser.specialization || null,
                    location: newUser.location || null,
                    role: roleValue
                }),
            });
            if (!response.ok) throw new Error('Ошибка создания пользователя');
            const data = await response.json();
            setUsers([...users, {
                id: data.userId,
                username: newUser.username,
                email: newUser.email,
                fullName: newUser.fullName,
                specialization: newUser.specialization,
                location: newUser.location,
                role: roleMap[newUser.role],
                isBlocked: false
            }].sort((a, b) => a.id - b.id));
            setShowCreateForm(false);
            setNewUser({
                username: '',
                password: '',
                email: '',
                fullName: '',
                specialization: '',
                location: '',
                role: '0'
            });
            toast.success('Пользователь создан');
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="admin-container">
            <h2>Управление пользователями</h2>
            <button
                className="admin-button"
                onClick={() => setShowCreateForm(true)}
                style={{ marginBottom: '20px' }}
            >
                Создать пользователя
            </button>

            {showCreateForm && (
                <form onSubmit={createUser} className="admin-form">
                    <input
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder="Username *"
                        required
                    />
                    <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Пароль *"
                        required
                    />
                    <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        placeholder="Email *"
                        required
                    />
                    <input
                        type="text"
                        value={newUser.fullName}
                        onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                        placeholder="Полное имя"
                    />
                    <input
                        type="text"
                        value={newUser.specialization}
                        onChange={(e) => setNewUser({ ...newUser, specialization: e.target.value })}
                        placeholder="Специализация"
                    />
                    <input
                        type="text"
                        value={newUser.location}
                        onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                        placeholder="Локация"
                    />
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                        <option value="0">Author</option>
                        <option value="1">Reviewer</option>
                        <option value="2">Admin</option>
                    </select>
                    <button type="submit" className="admin-button">Создать</button>
                    <button
                        type="button"
                        className="admin-button"
                        style={{ backgroundColor: '#dc3545', marginLeft: '10px' }}
                        onClick={() => setShowCreateForm(false)}
                    >
                        Отмена
                    </button>
                </form>
            )}

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя пользователя</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email || 'Не указано'}</td>
                        <td>{user.role}</td>
                        <td>{user.isBlocked ? 'Заблокирован' : 'Активен'}</td>
                        <td>
                            <button
                                onClick={() => toggleBlockUser(user.username, user.isBlocked)}
                                className="admin-button"
                            >
                                {user.isBlocked ? 'Разблокировать' : 'Заблокировать'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagment;