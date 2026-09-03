import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProjectsPage from "../pages/ProjectsPage";
import ProjectDetailsPage from "../pages/ProjectDetailsPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/common/ProtectedRoute";
import TasksPage from "../pages/TasksPage";

function AppRoutes() {
    return (
        <Routes>

            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/projects"
                element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                        <ProjectsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tasks"
                element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "employee"]}>
                        <TasksPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/projects/:projectId"
                element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                        <ProjectDetailsPage />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    );
}

export default AppRoutes;