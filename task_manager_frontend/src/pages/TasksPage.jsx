import { useEffect, useState } from "react";
import { getTasks, updateTask } from "../services/taskService";
import { getUsers } from "../services/userService";
import { useAuth } from "../hooks/useAuth";

function TasksPage() {
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [savingTaskId, setSavingTaskId] = useState(null);

    useEffect(() => {
        async function loadTasks() {
            try {
                const taskData = await getTasks();
                const userData = await getUsers();

                setTasks(taskData);
                setUsers(userData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadTasks();
    }, []);

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
        return (
            <div className="page-container">
                <p className="loading">Loading tasks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="page-container">

            <div className="tasks-header">
                <div>
                    <h1>Tasks</h1>
                    <p>
                        Welcome back, {user.name}. Here are your tasks.
                    </p>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <h3>No tasks found</h3>
                    <p>
                        You currently don't have any tasks assigned to you.
                    </p>
                </div>
            ) : (
                <div className="tasks-grid">

                    {tasks.map((task) => (

                        <div className="employee-task-card" key={task.id}>

                            <div className="task-card-top">
                                <h3>{task.title}</h3>

                                <span
                                    className={`status-badge status-${task.status}`}
                                >
                                    {task.status.replace("_", " ")}
                                </span>
                            </div>

                            <p className="task-description">
                                {task.description ||
                                    "No description provided."}
                            </p>

                            <div className="task-card-bottom">

                                <div className="task-assignee">
                                    <span>Assignee</span>
                                    <strong>
                                        {users.find((user) => user.id === task.assignee_id)?.name || "Unknown"}
                                    </strong>
                                </div>

                                <div className="task-status-control">

                                    <label htmlFor={`status-${task.id}`}>
                                        Status
                                    </label>

                                    <select
                                        id={`status-${task.id}`}
                                        value={task.status}
                                        disabled={
                                            savingTaskId === task.id
                                        }
                                        onChange={(event) =>
                                            handleStatusChange(
                                                task.id,
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>

                                        <option value="in_progress">
                                            In Progress
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>
                                    </select>

                                    {savingTaskId === task.id && (
                                        <span className="saving-text">
                                            Saving...
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default TasksPage;