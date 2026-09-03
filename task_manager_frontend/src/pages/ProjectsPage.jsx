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
        return <p>Loading projects...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Projects</h1>

            <form onSubmit={handleCreateProject}>
    <input
        type="text"
        placeholder="Project name"
        value={name}
        onChange={(event) => setName(event.target.value)}
    />

    <textarea
        placeholder="Project description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
    />

    <button type="submit">
        Create Project
    </button>
            </form>

            <Link to="/dashboard">
                Back to Dashboard
            </Link>

            {projects.length === 0 ? (
                <p>No projects found.</p>
            ) : (
                <ul>
                    {projects.map((project) => (
                        <li key={project.id}>
                            <Link to={`/projects/${project.id}`}>
                                {project.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProjectsPage;