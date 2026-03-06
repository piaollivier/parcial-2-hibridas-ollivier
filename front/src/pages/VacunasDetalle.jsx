import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToken } from "../context/SessionContext";

const VacunasDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useToken();
  const [vacuna, setVacuna] = useState(null);
  const [error, setError] = useState("");

  const apiBase = "http://localhost:3333";

  // ✅ perfilId SOLO si viene explícito en la URL (cuando entrás desde "Mis Vacunas")
  const perfilId = useMemo(() => searchParams.get("perfilId") || "", [searchParams]);

  const edadTexto = useMemo(() => {
    const e = vacuna?.edad_aplicacion;
    if (!e) return "—";
    if (Array.isArray(e)) return e.join(", ");
    return String(e);
  }, [vacuna]);

  useEffect(() => {
    if (!id) return;

    // Tu back tiene tokenValidate en GET /api/vacunas/:id → necesitás token sí o sí
    if (!token) {
      setError("No hay sesión activa (token). Volvé a loguearte.");
      return;
    }

    // ✅ si hay perfilId, lo mandamos. Si no hay, NO lo mandamos (detalle de catálogo)
    const url = perfilId
      ? `${apiBase}/api/vacunas/${id}?perfilId=${perfilId}`
      : `${apiBase}/api/vacunas/${id}`;

    console.log("URL detalle vacuna:", url);

    setError("");
    setVacuna(null);

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || `Error ${res.status}`);
        return data;
      })
      .then(setVacuna)
      .catch((err) => setError(err.message || "Error al obtener detalle"));
  }, [id, token, perfilId]);

  if (error) {
    return (
      <main className="card detalle-container">
        <div className="volver-wrapper">
          <button className="volver-btn" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
        <p style={{ color: "#b00020", fontWeight: 700 }}>{error}</p>
      </main>
    );
  }

  if (!vacuna) return <p className="loading">Cargando...</p>;

  return (
    <main className="card detalle-container">
      <div className="volver-wrapper">
        <button className="volver-btn" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>

      <div className="detalle-card-grid">
        <div className="detalle-img-col">
          {vacuna.imagen ? (
            <img
              src={vacuna.imagen}  
              alt={vacuna.nombre || "Vacuna"}
              className="detalle-img"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <p style={{ opacity: 0.7 }}>Sin imagen</p>
          )}
        </div>

        <div className="detalle-info-col">
          <h2 className="detalle-title">{vacuna.nombre}</h2>

          <p className="detalle-text">
            <strong>Previene:</strong> {vacuna.previene || "—"}
          </p>

          <p className="detalle-text">
            <strong>Edad de aplicación:</strong> {edadTexto}
          </p>

          <p className="detalle-text">
            <strong>Dosis:</strong> {vacuna.dosis || "—"}
          </p>

          <p className="detalle-text">
            <strong>Grupo etario:</strong> {vacuna.grupo || "—"}
          </p>

          <p className="detalle-text">
            <strong>Obligatoria:</strong> {vacuna.obligatoria ? "Sí" : "No"}
          </p>

          {vacuna.link && (
            <a
              href={vacuna.link}
              target="_blank"
              rel="noreferrer"
              className="detalle-btn"
            >
              Información oficial
            </a>
          )}
        </div>
      </div>
    </main>
  );
};

export default VacunasDetalle;