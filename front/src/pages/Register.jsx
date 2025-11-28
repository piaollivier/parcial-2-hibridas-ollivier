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
      .catch((err) => setError(err.message));
  };

  return (
    <main className="container mt-5" style={{ maxWidth: "500px" }}>
      
      <h2 className="text-center mb-4" style={{ color: "#06385f" }}>
        Crear cuenta
      </h2>

      {error && (
        <div className="alert alert-danger text-center py-2">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">

        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn w-100 text-white"
          style={{ backgroundColor: "#06385f" }}
        >
          Registrarme
        </button>

        {/* 👇 MISMO ESTILO QUE LOGIN */}
        <p className="text-center mt-3 mb-0">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" style={{ color: "#06385f", fontWeight: "bold" }}>
            Iniciar sesión
          </Link>
        </p>

      </form>
    </main>
  );
};

export default Register;
