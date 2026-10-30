import axios from "axios";

const AUTH_BASE = "http://localhost:8080/api/auth";

const AuthService = {
    login: (username, password) =>
        axios.post(`${AUTH_BASE}/login`, { username, password }),
};

export default AuthService;
