import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../context/SessionContext";

export default function PerfilesNuevo() {

  const navigate = useNavigate();
  const token = useToken();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    grupoSanguineo: "",
    factor: "",
    telefono: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const res = await fetch("http://localhost:3333/api/perfiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear perfil");
      }

      navigate("/perfiles");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth">

        <h1 className="card-auth__title">
          Crear nuevo perfil
        </h1>

        {error && (
          <p style={{ color: "#b00020", fontWeight: 600 }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="perfil-form">

          <label>
            Nombre
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Apellido
            <input
              type="text"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Fecha de nacimiento
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Número de DNI
            <input
              type="text"
              name="dni"
              value={form.dni}
              onChange={handleChange}
              placeholder="Ej: 12345678"
              maxLength="8"
              required
            />
          </label>

          <label>
            Grupo sanguíneo
            <select
              name="grupoSanguineo"
              value={form.grupoSanguineo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </label>

          <label>
            Factor
            <select
              name="factor"
              value={form.factor}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar</option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>
          </label>

          <label>
            Teléfono
            <input
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              required
            />
          </label>

          <div style={{
            marginTop: 20,
            display: "flex",
            gap: "10px",
            justifyContent: "center"
          }}>

            <button
              type="submit"
              className="boton"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Crear perfil"}
            </button>

            <button
              type="button"
              className="boton"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}