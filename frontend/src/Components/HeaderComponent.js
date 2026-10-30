import { Link } from "react-router-dom";

const HeaderComponent = () => {
    return (
        <header className="sp-navbar">
            <Link to="/" className="sp-navbar-brand">
                <div className="brand-icon">🎓</div>
                Student<span>Portal</span>
            </Link>
            <div className="sp-navbar-actions">
                <Link to="/add-student/-1" className="sp-btn-add">
                    ＋ Add Student
                </Link>
            </div>
        </header>
    );
};

export default HeaderComponent;