import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function DashboardPage() {

    const { user } = useAuth();

    return (
        <div className="page-container">

            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>
                    Welcome back, {user.name}. Here's an overview of your
                    task management workspace.
                </p>
            </div>

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Projects</h3>
                    <p>Manage your projects and their tasks.</p>

                    <Link to="/projects" className="dashboard-card-link">
                        View Projects →
                    </Link>
                </div>

                <div className="dashboard-card">
                    <h3>Tasks</h3>
                    <p>View and manage your assigned tasks.</p>

                    <Link to="/tasks" className="dashboard-card-link">
                        View Tasks →
                    </Link>
                </div>

                <div className="dashboard-card">
                    <h3>Your Account</h3>
                    <p>{user.email}</p>
                    <span className="role-badge">
                        {user.role}
                    </span>
                </div>

            </div>

        </div>
    );
}

export default DashboardPage;