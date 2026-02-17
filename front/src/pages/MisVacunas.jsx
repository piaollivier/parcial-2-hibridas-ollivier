import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUsuario } from "../context/SessionContext";

export default function MisVacunas() {
  const { userApp } = useUsuario();
  const [vacunas, setVacunas] = useState([]);

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${userApp?.username || userApp?.email}`;


  const obtenerMisVacunas = () => {
    if (!userApp?._id) return;

    fetch(`http://localhost:3333/api/vacunas?userId=${userApp._id}`)
      .then((res) => res.json())
      .then((data) => {
        const activas = data.filter((v) => !v.deleted);
        setVacunas(activas);
      })
      .catch(() => console.log("Error al obtener mis vacunas"));
  };

  useEffect(() => {
    obtenerMisVacunas();
  }, [userApp?._id]);

  const eliminarVacuna = (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar esta vacuna?"
    );
    if (!confirmar) return;

    fetch(
      `http://localhost:3333/api/vacunas/${id}?userId=${userApp._id}`,
      {
        method: "DELETE",
      }
    )
      .then(() => obtenerMisVacunas())
      .catch(() => console.log("Error al eliminar vacuna"));
  };

  return (
    <main className="mis-vacunas-container">
      <h1 style={{ visibility: "hidden" }}>Mis Vacunas</h1>


              <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            textAlign: "center",
            background: "linear-gradient(135deg, #f5f7fa, #e4ecf5)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <img
            src={avatarUrl}
            alt="Avatar usuario"
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #1e3a5f",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",

            }}
          />

          <span
            style={{
              fontWeight: "700",
              fontSize: "1.5rem",
              textTransform: "uppercase",
              color: "#1e3a5f",
              letterSpacing: "1px",
            }}
          >
            {userApp.username || "Usuario"}
          </span>      
          
<div style={{ margin: "24px 0", display: "flex", justifyContent: "center" }}>
  <Link
    to="/mis-vacunas/nueva"
    style={{
      background: "#1e3a5f",
      color: "#ffffff",
      padding: "12px 24px",
      borderRadius: "10px",
      textDecoration: "none",
      fontWeight: "600",
      fontSize: "0.95rem",
      letterSpacing: "0.5px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      transition: "all 0.2s ease",
      display: "inline-block",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#163047";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "#1e3a5f";
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    CARGAR NUEVA VACUNA
  </Link>
</div>

        </div>


    
      {vacunas.length === 0 ? (
        <p>No tenés vacunas cargadas.</p>
      ) : (
        <ul className="lista-vacunas">
          {vacunas.map((v) => (
            <li key={v._id} className="vacuna-item">
              <h3>{v.nombre}</h3>
              <p>
                <strong>Previene:</strong> {v.previene}
              </p>
              <p>
                <strong>Edad:</strong> {v.edad_aplicacion}
              </p>
              <p>
                <strong>Dosis:</strong> {v.dosis}
              </p>
              <p>
                <strong>Grupo:</strong> {v.grupo}
              </p>
              <p>
                <strong>Obligatoria:</strong> {v.obligatoria ? "Sí" : "No"}
              </p>

              <div className="btns d-flex justify-content-space-between">
                <button
                  onClick={() => eliminarVacuna(v._id)}
                  className="btn-borrar"
                >
                  Eliminar
                </button>

                <Link
                  to={`/mis-vacunas/editar/${v._id}`}
                  className="btn-editar"
                >
                  Editar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
