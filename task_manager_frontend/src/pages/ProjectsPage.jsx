import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects, createProject } from "../services/projectService";

function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    async function handleCreateProject(event) {
        event.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Project name is required.");
            return;
        }

        try {
            const newProject = await createProject(name, description);

            setProjects((currentProjects) => [
                ...currentProjects,
                newProject,
            ]);

            setName("");
            setDescription("");
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(() => {
        async function loadProjects() {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        loadProjects();
    }, []);

    if (loading) {
        return (
            <div className="page-container">
                <p className="loading">Loading projects...</p>
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

            <div className="projects-header">
                <div>
                    <h1>Projects</h1>
                    <p>Manage your projects and their tasks.</p>
                </div>

                <Link to="/dashboard" className="back-link">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="create-project-card">
                <h2>Create a New Project</h2>
                <p className="form-description">
                    Add a new project to your workspace.
                </p>

                <form onSubmit={handleCreateProject}>
                    <label>Project Name</label>

                    <input
                        type="text"
                        placeholder="Enter project name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />

                    <label>Project Description</label>

                    <textarea
                        placeholder="Enter project description"
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                    />

                    <button type="submit">
                        Create Project
                    </button>
                </form>
            </div>

            <div className="projects-section">
                <h2>Your Projects</h2>

                {projects.length === 0 ? (
                    <div className="empty-state">
                        <p>No projects found.</p>
                        <p>Create your first project above to get started.</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map((project) => (
                            <div className="project-card" key={project.id}>

                                <h3>{project.name}</h3>

                                <p>
                                    {project.description ||
                                        "No description provided."}
                                </p>

                                <Link
                                    to={`/projects/${project.id}`}
                                    className="project-card-link"
                                >
                                    View Project →
                                </Link>

                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

export default ProjectsPage;