import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToken } from "../context/SessionContext";

export default function EditarPerfil() {
  const { id } = useParams();
  const navegar = useNavigate();
  const token = useToken();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    dni: "",
    grupoSanguineo: "",
    factor: "",
    telefono: "",
  });

  const [error, setError] = useState("");

  const apiBase = "http://localhost:3333";

  useEffect(() => {
    async function cargarPerfil() {
      try {
        const res = await fetch(`${apiBase}/api/perfiles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Error al cargar perfil");

        setForm({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          fechaNacimiento: data.fechaNacimiento?.slice(0, 10) || "",
          dni: data.dni || "",
          grupoSanguineo: data.grupoSanguineo || "",
          factor: data.factor || "",
          telefono: data.telefono || "",
        });
      } catch (err) {
        setError(err.message);
      }
    }

    cargarPerfil();
  }, [id, token]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function guardar(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${apiBase}/api/perfiles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al actualizar perfil");

      navegar(`/perfiles/${id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth">

        <h1 className="card-auth__title">
          Editar perfil
        </h1>

        <form onSubmit={guardar} className="form-vacuna">

          <label>
            Nombre
            <input
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              required
            />
          </label>

          <label>
            Apellido
            <input
              name="apellido"
              value={form.apellido}
              onChange={onChange}
            />
          </label>

          <label>
            Fecha de nacimiento
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={onChange}
            />
          </label>

          <label>
            DNI
            <input
              name="dni"
              value={form.dni}
              onChange={onChange}
            />
          </label>

          <label>
            Grupo sanguíneo
            <select
              name="grupoSanguineo"
              value={form.grupoSanguineo}
              onChange={onChange}
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
              onChange={onChange}
            >
              <option value="">Seleccionar</option>
              <option value="+">+</option>
              <option value="-">-</option>
            </select>
          </label>

          <label>
            Teléfono
            <input
              name="telefono"
              value={form.telefono}
              onChange={onChange}
            />
          </label>

          {error && (
            <p style={{ color: "red", marginTop: 10 }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button type="submit" className="btn-primary-auth">
              Guardar cambios
            </button>

            <button
              type="button"
              className="btn-editar"
              onClick={() => navegar(-1)}
            >
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}