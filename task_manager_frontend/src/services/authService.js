import apiRequest from "../api/apiRequest";

async function login(email, password) {

    return apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });

}

async function register(name, email, password) {

    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });

}

async function getCurrentUser() {

    return apiRequest("/auth/me", {
        method: "GET",
    });

}

export {
    login,
    register,
    getCurrentUser,
};