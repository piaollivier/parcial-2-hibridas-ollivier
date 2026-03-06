import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../context/SessionContext";

function CardPerfil({ perfil, extraLinea, acciones, esCompartido = false }) {
  return (
    <li className="vacuna-item">
      <div className="perfil-card">
        <div className="perfil-card-info">
          <h3>{perfil.nombre}</h3>

          {perfil.apellido && <p className="perfil-apellido">{perfil.apellido}</p>}

          {extraLinea && <p className="perfil-extra">{extraLinea}</p>}

          <p className="perfil-tipo">
            {esCompartido ? "Perfil compartido" : "Perfil propio"}
            {Array.isArray(perfil.miembros)
              ? ` · Miembros: ${perfil.miembros.length}`
              : ""}
          </p>
        </div>

        <div className="perfil-acciones">{acciones}</div>
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
          fetch("http://localhost:3333/api/perfiles/mios", {
            headers: headersAuth,
          }),
          fetch("http://localhost:3333/api/perfiles/compartidos", {
            headers: headersAuth,
          }),
        ]);

        const dMios = await rMios.json().catch(() => []);
        const dCompartidos = await rCompartidos.json().catch(() => []);

        setMios(Array.isArray(dMios) ? dMios : []);
        setCompartidos(Array.isArray(dCompartidos) ? dCompartidos : []);
      } catch (e) {
        setErrorPerfiles("Error al cargar perfiles");
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
          <h1 className="card-auth__title">Mi perfil</h1>
          <p>No hay sesión activa.</p>

          <button className="boton" onClick={() => navigate("/login")}>
            Ir a login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth">

        <h1 className="card-auth__title">Mi perfil</h1>


        <div className="perfil-usuario-card">

          <img src={avatarUrl} alt="Avatar usuario" className="perfil-avatar" />

          <span className="perfil-username">
            {userApp.username || "Usuario"}
          </span>

          <div className="perfil-datos">
            <p><strong>Email:</strong> {userApp.email}</p>
            {userApp.nombre && (
              <p><strong>Nombre:</strong> {userApp.nombre}</p>
            )}
          </div>

          <div className="perfil-resumen">

            <div className="perfil-stat">
              <p>Creados</p>
              <span>{mios.length}</span>
            </div>

            <div className="perfil-stat">
              <p>Compartidos</p>
              <span>{compartidos.length}</span>
            </div>

            <div className="perfil-stat">
              <p>Total</p>
              <span>{mios.length + compartidos.length}</span>
            </div>

          </div>

        </div>

        <div className="perfil-acciones-principales">

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

        <div className="perfil-listado">

          <h2>Resumen de perfiles</h2>

          {cargandoPerfiles ? (
            <p>Cargando perfiles...</p>
          ) : errorPerfiles ? (
            <p className="perfil-error">{errorPerfiles}</p>
          ) : (
            <>
              <div>

                <p className="perfil-listado-titulo">Creados por mí</p>

                {mios.length === 0 ? (
                  <p>No creaste perfiles todavía.</p>
                ) : (
                  <ul className="lista-vacunas">
                    {mios.map((p) => (
                      <CardPerfil
                        key={p._id}
                        perfil={p}
                        extraLinea="Creado por vos"
                        acciones={
                          <>
                            <button
                              className="btn-editar"
                              onClick={() => navigate(`/perfiles/${p._id}`)}
                            >
                              Ver
                            </button>

                            <button
                              className="btn-editar"
                              onClick={() =>
                                navigate(`/mis-vacunas?perfilId=${p._id}`)
                              }
                            >
                              Vacunas
                            </button>
                          </>
                        }
                      />
                    ))}
                  </ul>
                )}
              </div>

              <div>

                <p className="perfil-listado-titulo">Compartidos conmigo</p>

                {compartidos.length === 0 ? (
                  <p>No tenés perfiles compartidos.</p>
                ) : (
                  <ul className="lista-vacunas">
                    {compartidos.map((p) => (
                      <CardPerfil
                        key={p._id}
                        perfil={p}
                        esCompartido
                        extraLinea={`Compartido por: ${
                          p.ownerUsername || p.ownerEmail || "—"
                        }`}
                        acciones={
                          <>
                            <button
                              className="btn-editar"
                              onClick={() => navigate(`/perfiles/${p._id}`)}
                            >
                              Ver
                            </button>

                            <button
                              className="btn-editar"
                              onClick={() =>
                                navigate(`/mis-vacunas?perfilId=${p._id}`)
                              }
                            >
                              Vacunas
                            </button>
                          </>
                        }
                      />
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        <div className="perfil-volver">
          <button className="boton" onClick={() => navigate("/")}>
            Volver
          </button>
        </div>

      </div>
    </main>
  );
}