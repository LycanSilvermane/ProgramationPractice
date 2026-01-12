import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getProjects, createProject, deleteProject } from "../api/api";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState("");
  const { getValidToken } = useAuth();
  const { isAdmin } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  //--cargar proyectos--

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const validToken = await getValidToken();
      if (!validToken) throw new Error("No autenticado");

      const data = await getProjects(validToken);
      setProjects(data || []);
    } catch (err) {
      console.error(err);
      setError("Error al cargar proyectos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  //--crear--

  const handleCreate = async () => {
    if (!newProjectName || creating) return;
    setCreating(true);
    setSuccess("");
    setError("");

    try {
      const validToken = await getValidToken();
      if (!validToken) throw new Error("No autenticado");

      const project = await createProject(validToken, newProjectName);
      setProjects((prev) => [...prev, { ...project, isNew: true }]);
      setNewProjectName("");
      setSuccess("Proyecto creado correctamente");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear el proyecto");
      setTimeout(() => setError(""), 4000);
    } finally {
      setCreating(false);
    }
  };

  //--borrar--

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    setDeleting(true);

    try {
      const validToken = await getValidToken();
      if (!validToken) throw new Error("No autenticado");

      await deleteProject(validToken, projectToDelete.display_id);
      setProjects((prev) =>
        prev.filter((p) => p.display_id !== projectToDelete.display_id)
      );
      setSuccess("Proycto borrado correctamente");
      setTimeout(() => setSuccess(""), 4000);
    } catch (error) {
      console.error(error);
      setError("Error al borrar proyecto");
      setTimeout(() => setError(""), 4000);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  return (
    <div className="container">
      <Navbar />
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="alert alert-info">Cargando proyectos...</div>
      ) : projects.length === 0 ? (
        <div className="alert alert-danger">No hay proyectos</div>
      ) : (
        <>
          <h1 className="mb-3">Mis Proyectos</h1>
          <ul className="list-group mb-3">
            {projects.map((project) => (
              <li
                key={project.id}
                className={`list-group-item d-flex align-items-center ${
                  project.isNew ? "animate__animated animate__slideInUp" : ""
                }`}
                onAnimationEnd={() => {
                  if (project.isNew) {
                    setProjects((prev) =>
                      prev.map((p) =>
                        p.id === project.id ? { ...p, isNew: false } : p
                      )
                    );
                  }
                }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  className="flex-grow-1 text-center"
                >
                  {project.name} - {project.display_id}
                </Link>

                {isAdmin && (
                  <button
                    className="btn btn-danger btn-sm ms-auto"
                    onClick={() => {
                      setProjectToDelete(project);
                      setShowDeleteModal(true);
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="mb-3">Crear nuevo proyecto</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <button onClick={handleCreate} disabled={creating}>
          {creating ? "Creando..." : "Crear proyecto"}
        </button>
      </div>
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteProject}
        loading={deleting}
        title="Eliminar proyecto"
        message={
          <>
            ¿Estás seguro de que deseas borrar el proyecto{" "}
            <strong>{projectToDelete?.name}</strong>?
          </>
        }
      />
    </div>
  );
}

export default Dashboard;
