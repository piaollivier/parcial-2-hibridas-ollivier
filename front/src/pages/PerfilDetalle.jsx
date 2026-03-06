import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsuario } from "../context/SessionContext";

export default function PerfilDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userApp } = useUsuario();

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const headersAuth = useMemo(() => {
    return {
      Authorization: `Bearer ${userApp?.token}`,
    };
  }, [userApp?.token]);

  // helpers
  const fmtFecha = (iso) => {
    if (!iso) return "—";
    // si viene "YYYY-MM-DD"
    if (typeof iso === "string" && iso.length >= 10) {
      const y = iso.slice(0, 4);
      const m = iso.slice(5, 7);
      const d = iso.slice(8, 10);
      if (y && m && d) return `${d}/${m}/${y}`;
    }
    try {
      const dt = new Date(iso);
      if (isNaN(dt.getTime())) return String(iso);
      return dt.toLocaleDateString();
    } catch {
      return String(iso);
    }
  };

  const esCompartido = useMemo(() => {
    if (!perfil || !userApp?._id) return false;
    return String(perfil.ownerId) !== String(userApp._id);
  }, [perfil, userApp?._id]);

  useEffect(() => {
    if (!userApp?.token) return;
    if (!id) return;

    const cargar = async () => {
      setCargando(true);
      setError("");
      setPerfil(null);

      try {
        const res = await fetch(`http://localhost:3333/api/perfiles/${id}`, {
          headers: headersAuth,
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.error || "No se pudo cargar el perfil");
        }

        setPerfil(data);
      } catch (e) {
        setError(e?.message || "Error al cargar el perfil");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [id, userApp?.token, headersAuth]);

  if (!userApp) {
    return (
      <main className="mis-vacunas-crear">
        <div className="card-auth">
          <h1 className="card-auth__title">Perfil</h1>
          <p>No hay sesión activa. Por favor iniciá sesión.</p>
          <div style={{ marginTop: 18 }}>
            <button className="boton" onClick={() => navigate("/login")}>
              Ir a login
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <button
            type="button"
            className="btn-editar"
            onClick={() => navegar(`/perfiles/${perfil._id}/editar`)}
          >
            Editar perfil
          </button>

          <button
            type="button"
            className="boton"
            onClick={() => navegar(-1)}
          >
            Volver
          </button>

          {perfil?._id && (
            <button className="boton" onClick={() => navigate(`/mis-vacunas?perfilId=${perfil._id}`)}>
              Ver vacunas
            </button>
          )}
        </div>

        <h1 className="card-auth__title" style={{ marginTop: 16 }}>
          Detalle del perfil
        </h1>

        {cargando ? (
          <p>Cargando perfil...</p>
        ) : error ? (
          <p style={{ color: "#b00020", fontWeight: 700 }}>{error}</p>
        ) : !perfil ? (
          <p>No se encontró el perfil.</p>
        ) : (
          <>
            {/* Encabezado */}
            <div
              style={{
                marginTop: 14,
                background: "linear-gradient(135deg, #f5f7fa, #e4ecf5)",
                borderRadius: 16,
                padding: 18,
              }}
            >
              <h2 style={{ margin: 0, color: "#1e3a5f" }}>
                {perfil.nombre || "—"} {perfil.apellido || ""}
              </h2>

              <p style={{ margin: "8px 0 0", opacity: 0.8 }}>
                {esCompartido ? (
                  <>
                    <strong>Compartido por:</strong>{" "}
                    {perfil.ownerUsername || perfil.ownerEmail || "—"}
                  </>
                ) : (
                  <strong>Creado por vos</strong>
                )}
              </p>
            </div>

            {/* Datos */}
            <div style={{ marginTop: 18 }} className="perfil-datos">
              <p>
                <strong>Nombre:</strong> {perfil.nombre || "—"}
              </p>
              <p>
                <strong>Apellido:</strong> {perfil.apellido || "—"}
              </p>
              <p>
                <strong>Fecha de nacimiento:</strong> {fmtFecha(perfil.fechaNacimiento)}
              </p>
              <p>
                <strong>DNI:</strong> {perfil.dni || "—"}
              </p>
              <p>
                <strong>Grupo sanguíneo:</strong> {perfil.grupoSanguineo || "—"}
              </p>
              <p>
                <strong>Factor:</strong> {perfil.factor || "—"}
              </p>
              <p>
                <strong>Teléfono:</strong> {perfil.telefono || "—"}
              </p>
            </div>

            {/* Extra: si querés mostrar miembros */}
            {Array.isArray(perfil.miembros) && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontWeight: 800, marginBottom: 6, color: "#1e3a5f" }}>
                  Miembros (IDs)
                </p>
                <div style={{ opacity: 0.8, fontSize: 13 }}>
                  {perfil.miembros.length === 0 ? (
                    <p>—</p>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {perfil.miembros.map((m, idx) => (
                        <li key={`${m}-${idx}`}>{String(m)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}