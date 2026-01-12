const API_URL = "http://localhost:8000/api";

export async function login(username, password) {
    const response = await fetch(`${API_URL}/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password}),
    });

    if (!response.ok) {
        console.log("STATUS:", response.status);
        const data = await response.json();
        console.log("RESPONSE:", data);
        throw new Error("Login Failed");
    }

    return await response.json();
}

export async function getMe(token) {
    const res = await fetch(`${API_URL}/me/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const data = await response.json();
        console.log("Error al obtener usuario:", data);
        throw new Error("Error obteniendo usuario");
    }
    return await res.json();    
}

export async function getProjects(token) {
    const response = await fetch(`${API_URL}/projects/`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("No se pudieron obtener los proyectos");
    }
    
    return await response.json();
}

export async function getProjectByDisplayId(token, displayId) {
    const res = await fetch(
    `${API_URL}/projects/by-display/${displayId}/`,
    {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    }
);

    if (!res.ok) {
        throw new Error("Proyecto no encontrado");
    } 

    return res.json();
}

export async function createProject(token, name) {
    const response = await fetch(`${API_URL}/projects/`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({name}),
    });

    if(!response.ok) throw new Error("Error al crear proyecto");
    
    return await response.json();
}

export async function getProjectTasks(token, projectDisplayId) {
    const response = await fetch(`${API_URL}/tasks/?project=${projectDisplayId}`, {
        headers: {"Content-Type": "application/json",
        Authorization: `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error("Error al obtener tareas");
    return await response.json();
}

export async function deleteProject(token, projectDisplayId) {
    const response = await fetch(`${API_URL}/projects/${projectDisplayId}/`,{
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(()=> ({}));
        console.error("Error borrando proyecto", errorData);
        throw new Error("Error al borrar el proyecto");
    }
}

export async function createTask(token, projectId, title) {
    const response = await fetch(`${API_URL}/tasks/`,{
        method: "POST",
        headers:{"Content-Type":"application/json",
        Authorization: `Bearer ${token}`},
        body: JSON.stringify({
            title, 
            project: projectId,
            status: "pending",}),
    });
    if (!response.ok){
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error("Error al crear tarea");
    }
    return await response.json();
}

export async function deleteTask(token, taskId) {
    const res= await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Error al borrar tarea");
}

export async function updateTask(token, taskId, data) {
    const res = await fetch(`${API_URL}/tasks/${taskId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al editar");

    return res.json();
}

export async function registerNewUser({username, email, password}){
    const res = await fetch(`${API_URL}/register/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username, email, password}),
    });

    console.log("STATUS:", res.status);

    const data = await res.json();
    console.log("RESPONSE:", data);

    if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
    }

    return data;
}

export async function getAllUsers(token){
    const res = await fetch(`${API_URL}/admin/users/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) throw new Error("Error cargando usuarios");
    return res.json();
}

export async function updateUser(token, userId, data) {
    const res = await fetch(`${API_URL}/admin/users/${userId}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error actualizando usuario");
    return res.json();
}
