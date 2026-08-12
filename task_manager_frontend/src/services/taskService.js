import apiRequest from "../api/apiRequest";

async function getTasks() {
    return apiRequest("/tasks", {
        method: "GET",
    });
}

async function getTask(taskId) {
    return apiRequest(`/tasks/${taskId}`, {
        method: "GET",
    });
}

async function createTask(title, description, status, projectId, assigneeId) {
    return apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify({
            title,
            description,
            status,
            project_id: projectId,
            assignee_id: assigneeId
        }),
    });
}

async function updateTask(
    taskId,
    title,
    description,
    status,
    projectId
) {
    return apiRequest(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify({
            title,
            description,
            status,
            project_id: projectId,
        }),
    });
}

async function deleteTask(taskId) {
    return apiRequest(`/tasks/${taskId}`, {
        method: "DELETE",
    });
}

async function getProjectTasks(projectId) {
    return apiRequest(`/projects/${projectId}/tasks`, {
        method: "GET",
    });
}

export {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    getProjectTasks,
};