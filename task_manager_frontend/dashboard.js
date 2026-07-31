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
    try {
        const response = await fetch(
            `http://127.0.0.1:8000/tasks/project/${projectId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if (!response.ok) {
            console.log(await response.json());
            return;
        }

        const tasks = await response.json();
        let taskList = document.getElementById("taskList");
        taskList.innerHTML = "";
        tasks.forEach(function(task) {
            let li = document.createElement("li");
            li.textContent = `${task.title} (${task.status})`;
            taskList.appendChild(li);
});

    } catch (error) {
        console.log(error);
    }
}

loadUser();

loadProjects();

document.getElementById("logoutBtn").addEventListener("click", logout);

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}