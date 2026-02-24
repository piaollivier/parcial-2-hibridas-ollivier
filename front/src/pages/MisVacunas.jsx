import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useUsuario,
  usePerfilActivo,
  useSeleccionarPerfil,
} from "../context/SessionContext";

export default function MisVacunas() {
  const { userApp } = useUsuario();

const perfilActivo = usePerfilActivo();
const seleccionarPerfil = useSeleccionarPerfil();

  const [perfiles, setPerfiles] = useState([]);
  const [perfilIdLocal, setPerfilIdLocal] = useState(perfilActivo?._id || "");
  const [vacunas, setVacunas] = useState([]);

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${userApp?.username || userApp?.email}`;

  // 1) cargar perfiles del user
  useEffect(() => {
    if (!userApp?.token) return;

    fetch("http://localhost:3333/api/perfiles", {
      headers: { Authorization: `Bearer ${userApp.token}` },
    })
      .then((res) => res.json())
      .then((data) => setPerfiles(Array.isArray(data) ? data : []))
      .catch(() => console.log("Error al obtener perfiles"));
  }, [userApp?.token]);

  // sincronizar select con contexto
  useEffect(() => {
    if (perfilActivo?._id) setPerfilIdLocal(perfilActivo._id);
  }, [perfilActivo?._id]);

  const obtenerVacunas = (perfilId) => {
    if (!perfilId) {
      setVacunas([]);
      return;
    }

    fetch(`http://localhost:3333/api/vacunas?perfilId=${perfilId}`)
      .then((res) => res.json())
      .then((data) => {
        const activas = (Array.isArray(data) ? data : []).filter((v) => !v.deleted);
        setVacunas(activas);
      })
      .catch(() => console.log("Error al obtener vacunas del perfil"));
  };

  // 2) cargar vacunas cada vez que cambia el perfil seleccionado
  useEffect(() => {
    obtenerVacunas(perfilIdLocal);
  }, [perfilIdLocal]);

  const onChangePerfil = (e) => {
    const id = e.target.value;
    setPerfilIdLocal(id);

    const perfil = perfiles.find((p) => p._id === id);
    if (perfil) seleccionarPerfil(perfil);
  };

  const eliminarVacuna = (id) => {
    const confirmar = window.confirm("¿Seguro que querés eliminar esta vacuna?");
    if (!confirmar) return;

    fetch(`http://localhost:3333/api/vacunas/${id}?perfilId=${perfilIdLocal}`, {
      method: "DELETE",
    })
      .then(() => obtenerVacunas(perfilIdLocal))
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
          {userApp?.username || "Usuario"}
        </span>

        {/* ✅ SELECT PERFIL (FILTRO) */}
        <div style={{ width: "100%", maxWidth: 420, textAlign: "left" }}>
          <label style={{ fontWeight: 600, color: "#1e3a5f" }}>
            Perfil
            <select
              className="input-auth"
              value={perfilIdLocal}
              onChange={onChangePerfil}
              style={{ width: "100%", marginTop: 8 }}
            >
              <option value="">— Seleccionar perfil —</option>
              {perfiles.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Botón crear vacuna: solo habilitado si hay perfil */}
        <div style={{ margin: "18px 0", display: "flex", justifyContent: "center" }}>
          <Link
            to="/mis-vacunas/nueva"
            style={{
              background: perfilIdLocal ? "#1e3a5f" : "#9aa7b6",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "0.95rem",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              display: "inline-block",
              pointerEvents: perfilIdLocal ? "auto" : "none",
            }}
          >
            CARGAR NUEVA VACUNA
          </Link>
        </div>
      </div>

      {!perfilIdLocal ? (
        <p>Seleccioná un perfil para ver sus vacunas.</p>
      ) : vacunas.length === 0 ? (
        <p>No hay vacunas cargadas para este perfil.</p>
      ) : (
        <ul className="lista-vacunas">
          {vacunas.map((v) => (
            <li key={v._id} className="vacuna-item">
              <h3>{v.nombre}</h3>
              <p><strong>Previene:</strong> {v.previene}</p>
              <p><strong>Edad:</strong> {v.edad_aplicacion}</p>
              <p><strong>Dosis:</strong> {v.dosis}</p>
              <p><strong>Grupo:</strong> {v.grupo}</p>
              <p><strong>Obligatoria:</strong> {v.obligatoria ? "Sí" : "No"}</p>

              <div className="btns d-flex justify-content-space-between">
                <button onClick={() => eliminarVacuna(v._id)} className="btn-borrar">
                  Eliminar
                </button>

                <Link
                  to={`/mis-vacunas/editar/${v._id}?perfilId=${perfilIdLocal}`}
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
