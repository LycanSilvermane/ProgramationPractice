import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { getAllUsers, updateUser, getProjects } from "../api/api";
import { ROLES } from "../constants/roles";
import RoleBadge from "../components/RoleBadge";

function AdminPanel() {
  const { isAdmin, getValidToken, user: currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) return;

    async function fetchData() {
      setLoading(true);
      setError("");

      try {
        const token = await getValidToken();

        const resProjects = await getProjects(token);
        setProjects(resProjects);

        const usersData = await getAllUsers(token);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        setError("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isAdmin, getValidToken]);

  const handleRoleChange = async (userId, data) => {
    try {
      const token = await getValidToken();
      const updated = await updateUser(token, userId, data);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, ...updated, groups: updated.groups || u.groups }
            : u
        )
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el rol");
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mt-3">
        <h3>No tienes permisos para ver esta página</h3>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <Navbar />
      <h1 className="mb-3">Panel de Administración</h1>

      {loading && <div className="alert alert-info">Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && (
        <>
          <h3>Proyectos</h3>
          <table className="table table-striped mb-5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Proyecto</th>
                <th>Owner</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.display_id}</td>
                  <td>{p.name}</td>
                  <td>{p.owner_username || p.owner}</td>
                  <td>
                    <Link
                      to={`/projects/${p.id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Usuarios</h3>
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td className="d-flex align-items-center gap-3">
                    {u.groups?.[0] && <RoleBadge role={u.groups[0]} />}
                    <select
                      className="form-select form-select-sm"
                      value={u.groups[0] || "User"}
                      disabled={currentUser?.id === u.id}
                      onChange={(e) =>
                        handleRoleChange(u.id, { role: e.target.value })
                      }
                    >
                      {Object.values(ROLES).map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminPanel;
