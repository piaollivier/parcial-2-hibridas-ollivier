import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    const body = {
      username: form.username,
      email: form.email,
      password: form.password,
    };

    setError("");

    fetch("http://localhost:3333/api/userApp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al registrar usuario");
        return res.json();
      })
      .then(() => navigate("/login"))
      .catch((err) => setError(err.message || "Error al registrar usuario"));
  };

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth" style={{ maxWidth: "480px" }}>
        <h1 className="card-auth__title">Crear cuenta</h1>

        {error && (
          <p
            style={{
              backgroundColor: "#fde2e2",
              color: "#b3261e",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "0.9rem",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="form-vacuna">
          <label>
            Nombre de usuario
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              placeholder="Ingresar nombre de usuario"
            />
          </label>

          <label>
            Correo electrónico
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Ingresar correo electrónico"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Ingresar contraseña"
            />
          </label>

          <label>
            Confirmar contraseña
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Repetir contraseña"
            />
          </label>

          <button type="submit" className="btn-primary-auth">
            Registrarme
          </button>

          <p
            style={{
              marginTop: "12px",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              style={{ color: "#06385f", fontWeight: "600", textDecoration: "none" }}
            >
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Register;
