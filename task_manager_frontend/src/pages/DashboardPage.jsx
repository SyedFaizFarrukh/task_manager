import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <h2>Welcome, {user.name}</h2>

            <p>Email: {user.email}</p>

            <Link to="/projects">
                Projects
            </Link>

            <br />

            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default DashboardPage;