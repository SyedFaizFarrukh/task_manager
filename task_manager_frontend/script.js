let form = document.querySelector("form");

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try {
        const formData = new URLSearchParams();

        formData.append("username", email);
        formData.append("password", password);

        const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
        method: "POST",
        body: formData
    }
    );

    if (!response.ok) {
    const error = await response.json();
    alert(error.detail);
    return;
}

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    console.log("Token Saved");

    const token = localStorage.getItem("token");
    const meResponse = await fetch(
    "http://127.0.0.1:8000/auth/me",
    {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

        if (!meResponse.ok) {
    alert("Unable to fetch user information.");
    return;
}

    const meData = await meResponse.json();
    window.location.href = "dashboard.html";
        
    } catch(error) {
        console.log(error);
    }
});