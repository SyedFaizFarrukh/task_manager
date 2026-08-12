import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject, getProjectTasks } from "../services/projectService";
import { createTask } from "../services/taskService";
import { getUsers } from "../services/userService";

function ProjectDetailsPage() {
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [users, setUsers] = useState([]);
    const [assigneeId, setAssigneeId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
    async function loadProject() {
        try {
            const projectData = await getProject(projectId);
            const taskData = await getProjectTasks(projectId);
            const userData = await getUsers();

            setProject(projectData);
            setTasks(taskData);
            setUsers(userData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    loadProject();
}, [projectId]);

    if (loading) {
        return <p>Loading project...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <Link to="/projects">
                Back to Projects
            </Link>

            <h1>{project.name}</h1>

            <p>{project.description}</p>

            <h2>Tasks</h2>

            <form onSubmit={handleCreateTask}>
                <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                />

                <textarea
                placeholder="Task description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                />

                <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                </select>

                <select
                value={assigneeId}
                onChange={(event) => setAssigneeId(event.target.value)}
>
                    <option value="">Select Assignee</option>

                    {users.map((user) => (
                    <option key={user.id} value={user.id}>
                    {user.name}
                    </option>
            ))}
                </select>

                <button type="submit">
                Create Task
                </button>
            </form>

            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                    <li key={task.id}>
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                    <p>Status: {task.status}</p>
                    </li>
            ))}
                </ul>
)}
        </div>
    );

    async function handleCreateTask(event) {
    event.preventDefault();
    setError("");

    try {
        const newTask = await createTask(
            title,
            description,
            status,
            projectId,
            assigneeId
        );

        setTasks((currentTasks) => [
            ...currentTasks,
            newTask,
        ]);

        setTitle("");
        setDescription("");
        setStatus("pending");
    } catch (error) {
        setError(error.message);
    }
}
}

export default ProjectDetailsPage;