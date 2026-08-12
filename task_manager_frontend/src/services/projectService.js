import apiRequest from "../api/apiRequest";

async function getProjects() {
    return apiRequest("/projects", {
        method: "GET",
    });
}

async function getProject(projectId) {
    return apiRequest(`/projects/${projectId}`, {
        method: "GET",
    });
}

async function createProject(name, description) {
    return apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify({
            name,
            description,
        }),
    });
}

async function updateProject(projectId, name, description) {
    return apiRequest(`/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify({
            name,
            description,
        }),
    });
}

async function deleteProject(projectId) {
    return apiRequest(`/projects/${projectId}`, {
        method: "DELETE",
    });
}

async function getProjectTasks(projectId) {
    return apiRequest(`/tasks/project/${projectId}`, {
        method: "GET",
    });
}

export {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectTasks,
};