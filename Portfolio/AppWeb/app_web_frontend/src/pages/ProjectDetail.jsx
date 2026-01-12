import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getProjects,
  getProjectTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../api/api";
import Navbar from "../components/Navbar";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

function ProjectDetail() {
  const { id } = useParams();
  const { getValidToken } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [project, setProject] = useState(null);
  const { isAdmin } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  //--cargar proyectos--

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      setError("");
      try {
        const validToken = await getValidToken();
        if (!validToken) throw new Error("No autenticado");

        const allProjects = await getProjects(validToken);

        const projectId = Number(id);
        if (isNaN(projectId)) throw new Error("ID de proyecto no válido");

        const proj = allProjects.find((p) => p.id === projectId);

        if (!proj) throw new Error("Proyecto no encontrado");

        setProject(proj);
      } catch (err) {
        console.error(err);
        setError("Error al cargar proyecto");
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [getValidToken, id]);

  //--cargar tareas--

  useEffect(() => {
    if (!project) return;

    async function fetchTasks() {
      setLoading(true);
      setError("");

      try {
        const validToken = await getValidToken();
        if (!validToken) throw new Error("No autenticado");

        const data = await getProjectTasks(validToken, project.id);
        setTasks(data || []);
        console.log(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar tareas");
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [project, getValidToken]);

  //--crearlas--

  const handleCreateTask = async () => {
    if (!newTaskTitle || creating || !project) return;

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const validToken = await getValidToken();
      if (!validToken) throw new Error("No autenticado");

      const task = await createTask(validToken, project.id, newTaskTitle);
      setTasks((prev) => [...prev, { ...task, isNew: true }]);
      setNewTaskTitle("");
      setSuccess("Tarea creada correctamente");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la tarea");
      setTimeout(() => setError(""), 4000);
    } finally {
      setCreating(false);
    }
  };

  //--Borrar--

  const handleDeleteTaskClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    setDeleting(true);

    try {
      const validToken = await getValidToken();
      if (!validToken) throw new Error("No autenticado");

      await deleteTask(validToken, taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setSuccess("Tarea Borrada correctamente");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError("No se pudo borrar la tarea");
      setTimeout(() => setError(""), 4000);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  //--Editar--

  const handleUpdateTask = async (taskId) => {
    if (!editTitle) return;

    setUpdatingId(taskId);
    setError("");

    try {
      const validToken = await getValidToken();
      if (!validToken) throw new Error("No autenticado");

      const updated = await updateTask(validToken, taskId, {
        title: editTitle,
      });

      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));

      setEditingId(null);
      setEditTitle("");
      setSuccess("Tarea actualizada con exito");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError("No se pudo editar la tarea");
      setTimeout(() => setError(""), 4000);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <h2>Proyecto {project ? project.display_id : "..."}</h2>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="alert alert-info">Cargando tareas...</div>
      ) : tasks.length === 0 ? (
        <div className="alert alert-warning">
          No hay tareas en este proyecto.
        </div>
      ) : (
        <ul className="list-group mb-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                task.isNew ? "animate__animated animate__slideInUp" : ""
              }`}
              onAnimationEnd={() => {
                if (task.inNew) {
                  setTasks((prev) =>
                    prev.map((t) =>
                      t.id === taskId ? { ...t, isNew: false } : t
                    )
                  );
                }
              }}
            >
              {editingId === task.id ? (
                <>
                  <input
                    type="text"
                    className="form-control me-2"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <div>
                    <button
                      className="btn btn-success me-1"
                      onClick={() => handleUpdateTask(task.id)}
                      disabled={updatingId === task.id}
                    >
                      {updatingId === task.id ? "Guardando..." : "💾"}
                    </button>
                    <button onClick={() => setEditingId(null)}>❌</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <span className="flex-grow-1">{task.title}</span>
                    <select
                      className="mx-2 me-3"
                      value={task.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        setUpdatingId(task.id);
                        setError("");
                        try {
                          const validToken = await getValidToken();
                          const updatedTask = await updateTask(
                            validToken,
                            task.id,
                            { ...task, status: newStatus }
                          );
                          setTasks((prev) =>
                            prev.map((t) =>
                              t.id === task.id ? updatedTask : t
                            )
                          );
                        } catch (err) {
                          console.error(err);
                          setError("No se pudo actualizar el estado");
                        } finally {
                          setUpdatingId(null);
                        }
                      }}
                      disabled={updatingId === task.id}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="in_progress">En progreso</option>
                      <option value="done">Completada</option>
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary me-1"
                      onClick={() => {
                        setEditingId(task.id);
                        setEditTitle(task.title);
                      }}
                    >
                      ✏️
                    </button>
                    {isAdmin && (
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDeleteTaskClick(task)}
                        disabled={deletingId === task.id}
                      >
                        {deletingId === task.id ? "Borrando..." : "🗑️"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nueva tarea"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={handleCreateTask}
          disabled={creating || !project}
        >
          {creating ? "Creando..." : "Crear Tarea"}
        </button>
      </div>
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteTask}
        loading={deleting}
        title="Eliminar tarea"
        message={
          <>
            ¿Estás seguro de que deseas borrar la tarea{" "}
            <strong>{taskToDelete?.title}</strong>?
          </>
        }
      />
    </div>
  );
}

export default ProjectDetail;
