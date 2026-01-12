import { useState } from "react";
import { login as apiLogin, getMe } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("limpiar err antes de login");
    setError("");

    try {
      const tokens = await apiLogin(username, password);

      const me = await getMe(tokens.access);
      setUserData(me);

      doLogin(tokens.access, tokens.refresh, me);

      navigate("/dashboard");
    } catch (err) {
      console.log("Login fallo:", err);
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <ThemeToggle />
      </div>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <form
          onSubmit={handleSubmit}
          className="p-4 border rounded shadow"
          style={{ minWidth: "300px", maxWidth: "400px", width: "100%" }}
        >
          <h1
            className="mb-4 text-center animate__animated animate__bounceIn"
            style={{
              borderBottom: "2px solid #0d6efd",
              display: "inline-block",
              paddingBottom: "4px",
            }}
          >
            Login
          </h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label className="mb-3">Usuario : </label>
            <input
              type="text"
              className="form-control"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label className="mb-3">Contraseña : </label>
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3 mb-3">
            Entrar
          </button>

          {userData && (
            <div>
              <h3>Bienvenido {userData.username}</h3>
              <p>
                Rol:{" "}
                {userData.groups.length
                  ? userData.groups.join(", ")
                  : "Sin rol"}
              </p>
            </div>
          )}

          <p className="mt-3">¿No tienes cuenta?</p>
          <Link to={`/registration`} className="flex-grow-1 text-center">
            Registrarse
          </Link>
        </form>
      </div>
    </>
  );
}

export default Login;
