import { useEffect, useState } from "react";
import { getTasks } from "../services/taskService";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

function TasksPage() {
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadTasks() {
            try {
                const taskData = await getTasks();
                setTasks(taskData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, []);

    if (loading) {
        return <p>Loading tasks...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Tasks</h1>

            <h2>Welcome, {user.name}</h2>

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                            <p>Status: {task.status}</p>
                            <p>Assignee ID: {task.assignee_id}</p>
                        </li>
                    ))}
                </ul>
            )}

            <Link to="/dashboard">
                Dashboard
            </Link>
        </div>
    );
}

export default TasksPage;