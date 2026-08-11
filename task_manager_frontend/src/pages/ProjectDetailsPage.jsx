import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject } from "../services/projectService";

function ProjectDetailsPage() {
    const { projectId } = useParams();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProject() {
            try {
                const data = await getProject(projectId);
                setProject(data);
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
        </div>
    );
}

export default ProjectDetailsPage;