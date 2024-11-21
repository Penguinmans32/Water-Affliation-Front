import api from './api';

const register = (username, email, password) => {
    return api.post('/auth/signup', {
        username,
        email,
        password,
    });
};

const login = (username, password) => {
    return api.post('/auth/login', {
        username,
        password,
    });
};

const AuthService = {
    register,
    login,
};

export default AuthService;

