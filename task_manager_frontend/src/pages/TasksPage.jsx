import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, updateTask } from "../services/taskService";
import { useAuth } from "../hooks/useAuth";

function TasksPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [savingTaskId, setSavingTaskId] = useState(null);

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

    function handleLogout() {
    logout();
    navigate("/login");
}

    async function handleStatusChange(taskId, newStatus) {
    setError("");
    setSavingTaskId(taskId);

    try {
        const task = tasks.find((task) => task.id === taskId);

        const updatedTask = await updateTask(
            taskId,
            task.title,
            task.description,
            newStatus,
            task.project_id,
            task.assignee_id
        );

        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === taskId ? updatedTask : task
            )
        );
    } catch (error) {
        setError(error.message);
    } finally {
        setSavingTaskId(null);
    }
}

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

            <button onClick={handleLogout}>
                Logout
            </button>

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id}>
                            <strong>{task.title}</strong>
                            <p>{task.description}</p>
                           <select
                                value={task.status}
                                disabled={savingTaskId === task.id}
                                onChange={(event) =>
                                handleStatusChange(task.id, event.target.value)
                                }
                            >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            </select>
                            {savingTaskId === task.id && (
                                <span> Saving...</span>
                            )}
                            <p>Assignee ID: {task.assignee_id}</p>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}

export default TasksPage;