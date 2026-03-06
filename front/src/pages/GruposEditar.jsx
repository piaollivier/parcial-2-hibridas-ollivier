import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const GruposEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3333/api/grupos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar grupo");
        return res.json();
      })
      .then((data) => {
        setNombre(data.nombre);
      })
      .catch(() => setError("Error al cargar grupo"));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3333/api/grupos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre }),  
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al editar grupo");
        return res.json();
      })
      .then(() => navigate("/grupos"))
      .catch(() => setError("No se pudo guardar el grupo"));
  };

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth">


        <h1 className="card-auth__title">Editar grupo</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} className="form-vacuna">
          <label>
            Nombre del grupo
            <input
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="btn-primary-auth">
            Guardar cambios
          </button>
          <button className="boton" onClick={() => navigate(-1)}>
            Volver
          </button>
        </form>
      </div>
    </main>
  );
};

export default GruposEditar;
