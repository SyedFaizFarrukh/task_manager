import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProtectedRoute({ children, allowedRoles }) {
    const { user, isAuthenticated, authLoading } = useAuth();

    if (authLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/tasks" replace />;
    }

    return children;
}

export default ProtectedRoute;