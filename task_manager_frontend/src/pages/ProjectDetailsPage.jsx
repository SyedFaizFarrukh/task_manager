import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
    getProject,
    getProjectTasks,
    updateProject,
    deleteProject
} from "../services/projectService";
import {
    createTask,
    updateTask,
    deleteTask
} from "../services/taskService";
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
        return (
            <div className="page-container">
                <p className="loading">Loading project...</p>
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

            <Link to="/projects" className="back-link">
                ← Back to Projects
            </Link>

            <div className="project-details-header">

                <div>
                    <h1>{project.name}</h1>

                    <p>
                        {project.description ||
                            "No description provided."}
                    </p>
                </div>

                <div className="project-actions">

                    <button
                        type="button"
                        className="secondary"
                        onClick={() => setEditingProject(true)}
                    >
                        Edit Project
                    </button>

                    <button
                        type="button"
                        className="danger"
                        onClick={() => handleDeleteProject(projectId)}
                    >
                        Delete Project
                    </button>

                </div>

            </div>

            {editingProject && (
                <div className="details-card">

                    <h2>Edit Project</h2>

                    <form onSubmit={handleUpdateProject}>

                        <label>Project Name</label>

                        <input
                            type="text"
                            value={projectName}
                            onChange={(event) =>
                                setProjectName(event.target.value)
                            }
                        />

                        <label>Project Description</label>

                        <textarea
                            value={projectDescription}
                            onChange={(event) =>
                                setProjectDescription(event.target.value)
                            }
                        />

                        <div className="form-actions">

                            <button type="submit">
                                Update Project
                            </button>

                            <button
                                type="button"
                                className="secondary"
                                onClick={() => setEditingProject(false)}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            <div className="tasks-section">

                <div className="section-header">
                    <div>
                        <h2>Tasks</h2>
                        <p>Manage tasks for this project.</p>
                    </div>
                </div>

                <div className="details-card">

                    <h2>
                        {editingTaskId === null
                            ? "Create a Task"
                            : "Edit Task"}
                    </h2>

                    <form onSubmit={handleCreateTask}>

                        <label>Task Title</label>

                        <input
                            type="text"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                        />

                        <label>Task Description</label>

                        <textarea
                            placeholder="Enter task description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        />

                        <label>Status</label>

                        <select
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value)
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

                        <label>Assignee</label>

                        <select
                            value={assigneeId}
                            onChange={(event) =>
                                setAssigneeId(event.target.value)
                            }
                        >
                            <option value="">
                                Select Assignee
                            </option>

                            {users
                                .filter((user) =>
                                    currentUser.role === "admin" ||
                                    (
                                        currentUser.role === "manager" &&
                                        user.role === "employee"
                                    )
                                )
                                .map((user) => (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.name}
                                    </option>
                                ))}
                        </select>

                        <div className="form-actions">

                            <button type="submit">
                                {editingTaskId === null
                                    ? "Create Task"
                                    : "Update Task"}
                            </button>

                            {editingTaskId !== null && (
                                <button
                                    type="button"
                                    className="secondary"
                                    onClick={() => {
                                        setEditingTaskId(null);
                                        setTitle("");
                                        setDescription("");
                                        setStatus("pending");
                                        setAssigneeId("");
                                    }}
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </div>

                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <p>No tasks found for this project.</p>
                    </div>
                ) : (
                    <div className="task-list">

                        {tasks.map((task) => (
                            <div className="task-card" key={task.id}>

                                <div className="task-card-content">

                                    <h3>{task.title}</h3>

                                    <p>
                                        {task.description ||
                                            "No description provided."}
                                    </p>

                                    <span
                                        className={`status-badge status-${task.status}`}
                                    >
                                        {task.status.replace("_", " ")}
                                    </span>

                                </div>

                                <div className="task-card-actions">

                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={() => {
                                            setEditingTaskId(task.id);
                                            setTitle(task.title);
                                            setDescription(
                                                task.description || ""
                                            );
                                            setStatus(task.status);
                                            setAssigneeId(
                                                task.assignee_id
                                            );
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="danger"
                                        onClick={() =>
                                            handleDeleteTask(task.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

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
            if (editingTaskId === null) {
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