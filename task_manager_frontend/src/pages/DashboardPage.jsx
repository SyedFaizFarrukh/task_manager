import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

function DashboardPage() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === "employee") {
            navigate("/tasks", { replace: true });
        }
    }, [user, navigate]);

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