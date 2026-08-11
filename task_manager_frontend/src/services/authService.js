import apiRequest from "../api/apiRequest";

async function login(email, password) {
    const formData = new URLSearchParams();

    formData.append("username", email);
    formData.append("password", password);

    return apiRequest("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
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