import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body mb-4 animate__animated animate__slideInLeft">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <Link
            to="/dashboard"
            className="nav-link link-primary link-offset-2"
            onMouseEnter={(e) => (e.target.style.color = linkHoverStyle.color)}
            onMouseLeave={(e) => (e.target.style.color = linkStyle.color)}
          >
            Inicio
          </Link>

          {isAdmin && (
            <Link to="/admin" className="nav-link link-primary link-offset-2">
              Admin
            </Link>
          )}
        </div>

        <div className="d-flex align-items-center gap-3">
          {user ? (
            <>
              <span className="text-body">
                Hola, {user.username} | Rol:{" "}
                {user.groups.length ? user.groups.join(", ") : "Sin rol"}
              </span>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-primari btn-sm">
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
