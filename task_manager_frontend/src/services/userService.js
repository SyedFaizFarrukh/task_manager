import apiRequest from "../api/apiRequest";

async function getUsers() {
    return apiRequest("/users", {
        method: "GET",
    });
}

export {
    getUsers,
};