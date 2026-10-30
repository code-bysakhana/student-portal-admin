import { useState } from "react";
import AuthService from "../Services/AuthService";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error,    setError]    = useState("");
    const [loading,  setLoading]  = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await AuthService.login(username.trim(), password);
            // Backend returns 200 with { username, message }
            localStorage.setItem("sp_auth", res.data.username);
            onLogin(res.data.username);
        } catch (err) {
            if (err.response?.status === 401) {
                setError("Invalid username or password.");
            } else if (err.code === "ERR_NETWORK") {
                setError("Cannot connect to server. Is the backend running?");
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sp-login-page">
            <div className="sp-login-card">
                <div className="sp-login-logo">
                    <div className="sp-login-logo-icon">🎓</div>
                    <div className="sp-login-logo-text">
                        Student<span>Portal</span>
                    </div>
                </div>

                <div className="sp-login-title">Admin Login</div>
                <div className="sp-login-sub">
                    Sign in with your administrator credentials
                </div>

                {error && <div className="sp-login-err">⚠ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="sp-fg">
                        <label className="sp-form-label">Username</label>
                        <input
                            className="sp-input"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                            required
                        />
                    </div>
                    <div className="sp-fg" style={{ marginBottom: 0 }}>
                        <label className="sp-form-label">Password</label>
                        <input
                            className="sp-input"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="sp-login-btn"
                        disabled={loading}
                    >
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
