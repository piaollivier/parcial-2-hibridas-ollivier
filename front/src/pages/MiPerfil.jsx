import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../context/SessionContext";

function Campo({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <p style={{ margin: "6px 0", opacity: 0.9 }}>
      <strong>{label}:</strong> {value}
    </p>
  );
}

function CardPerfil({ perfil, extraLinea, acciones }) {
  return (
    <li className="vacuna-item">
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>{perfil.nombre}</h3>

          {extraLinea && (
            <p style={{ margin: "6px 0 0", opacity: 0.75, fontSize: 13 }}>
              {extraLinea}
            </p>
          )}

          {/* ✅ “toda la info del perfil” (si existe en tu doc) */}
          <div style={{ marginTop: 10 }}>
            <Campo label="Apellido" value={perfil.apellido} />
            <Campo label="Fecha de nacimiento" value={perfil.fechaNacimiento} />
            <Campo label="DNI" value={perfil.dni} />
            <Campo label="Grupo sanguíneo" value={perfil.grupoSanguineo} />
            <Campo label="Factor" value={perfil.factor} />
            <Campo label="Teléfono" value={perfil.telefono} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {acciones}
        </div>
      </div>
    </li>
  );
}

export default function MiPerfil() {
  const navigate = useNavigate();
  const { userApp } = useUsuario();

  const [mios, setMios] = useState([]);
  const [compartidos, setCompartidos] = useState([]);
  const [cargandoPerfiles, setCargandoPerfiles] = useState(true);
  const [errorPerfiles, setErrorPerfiles] = useState("");

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${
    userApp?.username || userApp?.email || "usuario"
  }`;

  const headersAuth = useMemo(() => {
    return { Authorization: `Bearer ${userApp?.token}` };
  }, [userApp?.token]);

  useEffect(() => {
    if (!userApp?.token) return;

    const cargar = async () => {
      setCargandoPerfiles(true);
      setErrorPerfiles("");

      try {
        const [rMios, rCompartidos] = await Promise.all([
          fetch("http://localhost:3333/api/perfiles/mios", { headers: headersAuth }),
          fetch("http://localhost:3333/api/perfiles/compartidos", { headers: headersAuth }),
        ]);

        const dMios = await rMios.json().catch(() => []);
        const dCompartidos = await rCompartidos.json().catch(() => []);

        if (!rMios.ok) throw new Error(dMios?.error || "Error al obtener perfiles creados");
        if (!rCompartidos.ok) throw new Error(dCompartidos?.error || "Error al obtener perfiles compartidos");

        setMios(Array.isArray(dMios) ? dMios : []);
        setCompartidos(Array.isArray(dCompartidos) ? dCompartidos : []);
      } catch (e) {
        setErrorPerfiles(e?.message || "Error al cargar perfiles");
        setMios([]);
        setCompartidos([]);
      } finally {
        setCargandoPerfiles(false);
      }
    };

    cargar();
  }, [userApp?.token, headersAuth]);

  if (!userApp) {
    return (
      <main className="mis-vacunas-crear">
        <div className="card-auth">
          <h1 className="card-auth__title">Mi cuenta</h1>
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
        <h1 className="card-auth__title">Mi cuenta</h1>

        {/* Tarjeta usuario */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            textAlign: "center",
            background: "linear-gradient(135deg, #f5f7fa, #e4ecf5)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "18px",
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
        </div>

        {/* Datos */}
        <div className="perfil-datos">
          <p>
            <strong>Email:</strong> {userApp.email}
          </p>
          {userApp.nombre && (
            <p>
              <strong>Nombre:</strong> {userApp.nombre}
            </p>
          )}
        </div>

        {/* Acciones */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "16px",
            flexWrap: "wrap",
          }}
        >
          <button className="boton" onClick={() => navigate("/mis-vacunas")}>
            Ver mis vacunas
          </button>

          <button className="boton" onClick={() => navigate("/perfiles")}>
            Ver perfiles
          </button>

          <button className="boton" onClick={() => navigate("/perfiles/nuevo")}>
            Crear nuevo perfil
          </button>
        </div>

        {/* Listado perfiles */}
        <div style={{ marginTop: 22 }}>
          <h2 style={{ color: "#1e3a5f", marginBottom: 10 }}>Perfiles</h2>

          {cargandoPerfiles ? (
            <p>Cargando perfiles...</p>
          ) : errorPerfiles ? (
            <p style={{ color: "#b00020", fontWeight: 600 }}>{errorPerfiles}</p>
          ) : (
            <>
              {/* Creados */}
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontWeight: 800, marginBottom: 6 }}>Creados por mí</p>

                {mios.length === 0 ? (
                  <p style={{ opacity: 0.8 }}>No creaste perfiles todavía.</p>
                ) : (
                  <ul className="lista-vacunas">
                    {mios.map((p) => (
                      <CardPerfil
                        key={p._id}
                        perfil={p}
                        extraLinea="Perfil creado por vos"
                        acciones={
                          <>
                            <button
                              type="button"
                              className="btn-editar"
                              onClick={() => navigate(`/mis-vacunas?perfilId=${p._id}`)}
                              title="Abrí Mis Vacunas y elegí el perfil (si ya usás el select)"
                            >
                              Ver vacunas
                            </button>

                            <button
                              type="button"
                              className="btn-editar"
                              onClick={() => navigate(`/perfiles?share=${p._id}`)}
                              title="Compartir desde la pantalla Perfiles"
                            >
                              Compartir
                            </button>
                          </>
                        }
                      />
                    ))}
                  </ul>
                )}
              </div>

              {/* Compartidos */}
              <div>
                <p style={{ fontWeight: 800, marginBottom: 6 }}>Compartidos conmigo</p>

                {compartidos.length === 0 ? (
                  <p style={{ opacity: 0.8 }}>No tenés perfiles compartidos.</p>
                ) : (
                  <ul className="lista-vacunas">
                    {compartidos.map((p) => (
                      <CardPerfil
                        key={p._id}
                        perfil={p}
                        extraLinea={`Compartido por: ${p.ownerUsername || p.ownerEmail || "—"}`}
                        acciones={
                          <button
                            type="button"
                            className="btn-editar"
                            onClick={() => navigate(`/mis-vacunas?perfilId=${p._id}`)}
                          >
                            Ver vacunas
                          </button>
                        }
                      />
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {/* Volver */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 18 }}>
          <button className="boton" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    </main>
  );
}