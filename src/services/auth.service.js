import api from './api';

const login = async (usernameOrEmail, password) => {
    const response = await api.post('/auth/login', {
        usernameOrEmail,
        password,
    });
    if (response.data) {
        console.log('Login response:', response.data); // Debug log
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
};

const logout = () => {
    localStorage.removeItem('user');
};

const register = (username, email, password) => {
    return api.post('/auth/signup', {
        username,
        email,
        password,
    });
};

const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        return JSON.parse(userStr);
    }
    return null;
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;