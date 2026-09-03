import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        return null;
    }

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">

                <Link to="/tasks" className="navbar-brand">
                    Task Manager
                </Link>

                <div className="navbar-links">

                    {(user.role === "admin" || user.role === "manager") && (
                        <>
                            <Link to="/dashboard">
                                Dashboard
                            </Link>

                            <Link to="/projects">
                                Projects
                            </Link>
                        </>
                    )}

                    <Link to="/tasks">
                        Tasks
                    </Link>

                </div>

                <div className="navbar-user">
                    <div className="user-info">
                        <span className="user-name">
                            {user.name}
                        </span>

                        <span className="user-role">
                            {user.role}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;