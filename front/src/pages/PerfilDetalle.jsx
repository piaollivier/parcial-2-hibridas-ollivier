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

  const fmtFecha = (iso) => {
    if (!iso) return "—";

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

  const avatarPerfil = useMemo(() => {
    return (
      perfil?.avatar ||
      perfil?.avatarUrl ||
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
        `${perfil?.nombre || "perfil"}-${perfil?.apellido || ""}`
      )}`
    );
  }, [perfil]);

  useEffect(() => {
    if (!userApp?.token || !id) return;

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

async function dejarDeCompartir(emailAQuitar) {
  if (!perfil?._id || !emailAQuitar) return;

  try {
    const res = await fetch(
      `http://localhost:3333/api/perfiles/${perfil._id}/dejar-compartir`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userApp?.token}`,
        },
        body: JSON.stringify({ email: emailAQuitar }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || "No se pudo dejar de compartir");
    }

    setPerfil((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        miembrosUsuarios: (prev.miembrosUsuarios || []).filter(
          (u) => u.email !== emailAQuitar
        ),
      };
    });
  } catch (e) {
    alert(e?.message || "No se pudo dejar de compartir");
  }
}

  if (!userApp) {
    return (
      <main className="mis-vacunas-crear">
        <div className="card-auth">
          <div className="perfil-detalle-top">
            <h1 className="card-auth__title perfil-detalle-titulo">Perfil</h1>

            <button
              type="button"
              className="btn-editar"
              onClick={() => navigate("/login")}
            >
              Ir a login
            </button>
          </div>

          <p className="perfil-detalle-mensaje">
            No hay sesión activa. Por favor iniciá sesión.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth">
        <div className="perfil-detalle-top">
          <h1 className="card-auth__title perfil-detalle-titulo">
            Detalle del perfil
          </h1>

          <button
            type="button"
            className="btn-editar"
            onClick={() => navigate("/perfiles")}
          >
            Volver
          </button>
        </div>

        {cargando ? (
          <p>Cargando perfil...</p>
        ) : error ? (
          <p className="perfil-detalle-error">{error}</p>
        ) : !perfil ? (
          <p>No se encontró el perfil.</p>
        ) : (
          <>
            <div className="perfil-header-card">
              <img
                src={avatarPerfil}
                alt="Avatar del perfil"
                className="perfil-avatar-grande"
              />

              <h2 className="perfil-nombre">
                {perfil.nombre || "—"} {perfil.apellido || ""}
              </h2>

              <p className="perfil-owner">
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

            <div className="perfil-datos perfil-datos-detalle">
              <p>
                <strong>Nombre:</strong> {perfil.nombre || "—"}
              </p>
              <p>
                <strong>Apellido:</strong> {perfil.apellido || "—"}
              </p>
              <p>
                <strong>Fecha de nacimiento:</strong>{" "}
                {fmtFecha(perfil.fechaNacimiento)}
              </p>
              <p>
                <strong>DNI:</strong> {perfil.dni || "—"}
              </p>
              <p>
                <strong>Grupo sanguíneo:</strong>{" "}
                {perfil.grupoSanguineo || "—"}
              </p>
              <p>
                <strong>Factor:</strong> {perfil.factor || "—"}
              </p>
              <p>
                <strong>Teléfono:</strong> {perfil.telefono || "—"}
              </p>
            </div>

            {!esCompartido && perfil?.miembrosUsuarios?.length > 0 && (
  <div className="perfil-compartido-box">
    <h3 className="perfil-compartido-titulo">Compartido con</h3>

    {perfil.miembrosUsuarios
      .filter((u) => String(u._id) !== String(perfil.ownerId))
      .length === 0 ? (
      <p className="perfil-compartido-vacio">Este perfil no está compartido con otros usuarios.</p>
    ) : (
      <ul className="perfil-compartido-lista">
        {perfil.miembrosUsuarios
          .filter((u) => String(u._id) !== String(perfil.ownerId))
          .map((u) => (
            <li key={u._id} className="perfil-compartido-item">
              <div className="perfil-compartido-info">
                <span className="perfil-compartido-nombre">
                  {u.nombre || u.username || "Usuario"}
                </span>
                <span className="perfil-compartido-email">
                  {u.email || "Sin email"}
                </span>
              </div>

              <button
                type="button"
                className="btn-editar"
                onClick={() => dejarDeCompartir(u.email)}
              >
                Dejar de compartir
              </button>
            </li>
          ))}
      </ul>
    )}
  </div>
)}

            <div className="perfil-botones">
              <button
                type="button"
                className="btn-editar"
                onClick={() => navigate(`/perfiles/${perfil._id}/editar`)}
              >
                Editar perfil
              </button>

              {esCompartido && (
                <button
                  type="button"
                  className="btn-editar"
                  onClick={dejarDeCompartir}
                >
                  Dejar de compartir
                </button>
              )}

              <button
                type="button"
                className="btn-editar"
                onClick={() => navigate(`/mis-vacunas?perfilId=${perfil._id}`)}
              >
                Ver vacunas
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}