const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

async function loadUser() {

    const response = await fetch(
        "http://127.0.0.1:8000/auth/me",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const user = await response.json();

    document.getElementById("welcome").innerText =
        `Welcome, ${user.name}!`;
} 

async function loadProjects() {

    const response = await fetch(
        "http://127.0.0.1:8000/projects",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const projects = await response.json();
    const projectList = document.getElementById("projectList");

    projects.forEach(function(project) {
        const li = document.createElement("li");
        li.innerText = project.name;
        li.style.cursor = "pointer";
        li.addEventListener("click", function () {
           loadTasks(project.id);
});
        projectList.appendChild(li);
});
}

async function loadTasks(projectId) {

    console.log("Loading tasks for project:", projectId);

}

loadUser();

loadProjects();