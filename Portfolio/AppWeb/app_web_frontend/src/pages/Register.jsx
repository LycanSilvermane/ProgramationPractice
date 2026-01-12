import { useState } from "react";
import { registerNewUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await registerNewUser(form);
      setSuccess(`Usuario ${data.username} registrado correctamente`);
      setForm({
        username: "",
        email: "",
        password: "",
      });
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
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
          <h2
            className="mb-4 text-center"
            style={{
              borderBottom: "2px solid #0d6efd",
              display: "inline-block",
              paddingBottom: "4px",
            }}
          >
            Registro
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="mb-2">
            <label className="mb-2">Nombre de Usuario : </label>
            <input
              className="form-control"
              name="username"
              placeholder="Usuario"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="mb-2">Correo electronico : </label>
            <input
              className="form-control"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="mb-2">Contraseña : </label>
            <input
              className="form-control"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-90 mt-3 mb-3"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
