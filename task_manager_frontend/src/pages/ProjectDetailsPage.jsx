import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProject, getProjectTasks, updateProject, deleteProject } from "../services/projectService";
import { createTask, updateTask, deleteTask } from "../services/taskService";
import { getUsers } from "../services/userService";
import { useAuth } from "../hooks/useAuth";

function ProjectDetailsPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("pending");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [editingProject, setEditingProject] = useState(false);
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
            setProjectName(projectData.name);
            setProjectDescription(projectData.description || "");
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

            {(currentUser.role === "admin" || currentUser.role === "manager") && (
                <button
                    type="button"
                    onClick={() => setEditingProject(true)}
                >
                Edit Project
                </button>
            )}

            {(currentUser.role === "admin" || currentUser.role === "manager") && (
                <button
                    type="button"
                    onClick={() => handleDeleteProject(projectId)}
                >
                Delete Project
                </button>
            )}
                 
            {editingProject && (
                <form onSubmit={handleUpdateProject}>
                    <input
                    type="text"
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    />

                <textarea
                    value={projectDescription}
                    onChange={(event) =>
                    setProjectDescription(event.target.value)
                    }
                />

                <button type="submit">
                Update Project
                </button>

                <button
                type="button"
                onClick={() => setEditingProject(false)}
                >
                Cancel
                </button>
            </form>
)}
            <h2>Tasks</h2>
{(currentUser.role === "admin" || currentUser.role === "manager") && (
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

                    {users.filter((user) =>
                        currentUser.role === "admin" ||
                        (currentUser.role === "manager" && user.role === "employee")
                    ).map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))} 
                </select>

                <button type="submit">
                    {editingTaskId===null ? "Create Task" : "Update Task"}
                </button>
            </form>
)}
            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                    <li key={task.id}>
                    <strong>{task.title}</strong>
                    <p>{task.description}</p>
                    <p>Status: {task.status}</p>
                    <button 
                        type="button"
                        onClick={() => { 
                            setEditingTaskId(task.id);
                            setTitle(task.title);
                            setDescription(task.description || "");
                            setStatus(task.status);
                            setAssigneeId(task.assignee_id);
                        }}
                    > 
                        Edit 
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDeleteTask(task.id)}
                        >
                            Delete
                        </button>
                    </li>
            ))}
                </ul>
)}
        </div>
    );

    async function handleCreateTask(event) {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
        setError("Task title is required.");
        return;
    }

    if (!assigneeId) {
        setError("Please select an assignee.");
        return;
    }

    try {
        if (editingTaskId===null) {
        const newTask = await createTask(
            title,
            description,
            status,
            projectId,
            assigneeId
        );

        setTasks((currentTasks) => [
            newTask,
            ...currentTasks,
        ]);
    } else {
        const updatedTask = await updateTask(
            editingTaskId,
            title,
            description,
            status,
            projectId,
            assigneeId
        );

        setTasks((currentTasks) => 
            currentTasks.map((task) => 
                task.id === editingTaskId
                    ? updatedTask
                    : task
                )
            );
    }
        setTitle("");
        setDescription("");
        setStatus("pending");
        setAssigneeId("");
        setEditingTaskId(null);
    } catch (error) {
        setError(error.message);
    }
}

async function handleDeleteTask(taskId) {
    setError("");

    try {
        await deleteTask(taskId);

        setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== taskId)
        );
    } catch (error) {
        setError(error.message);
    }
}

async function handleUpdateProject(event) {
    event.preventDefault();
    setError("");

    if (!projectName.trim()) {
        setError("Project name is required.");
        return;
    }

    try {
        const updatedProject = await updateProject(
            projectId,
            projectName,
            projectDescription
        );

        setProject(updatedProject);
        setEditingProject(false);
    } catch (error) {
        setError(error.message);
    }
}

async function handleDeleteProject(projectId) {
    setError("");

    try {
        await deleteProject(projectId);
        navigate("/projects");
    } catch (error) {
        setError(error.message);
    }
}
}
export default ProjectDetailsPage;