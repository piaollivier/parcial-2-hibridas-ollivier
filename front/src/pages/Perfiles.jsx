import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../context/SessionContext";

export default function Perfiles() {
  const navigate = useNavigate();
  const { userApp } = useUsuario();

  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [error, setError] = useState("");

  // compartir
  const [shareOpenId, setShareOpenId] = useState(null);
  const [shareEmailById, setShareEmailById] = useState({});
  const [shareMsgById, setShareMsgById] = useState({});
  const [sharing, setSharing] = useState(false);

  const headersAuth = useMemo(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userApp?.token}`,
    };
  }, [userApp?.token]);

  const cargarPerfiles = async () => {
    if (!userApp?.token) {
      setLoading(false);
      setPerfiles([]);
      setError("No hay token en sesión. Cerrá sesión y volvé a loguearte.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3333/api/perfiles", {
        headers: headersAuth,
      });

      const data = await res.json().catch(() => []);

      if (!res.ok) throw new Error(data?.error || "Error al obtener perfiles");

      setPerfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error al obtener perfiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPerfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userApp?.token]);

  const crearPerfil = async (e) => {
    e.preventDefault();
    setError("");

    const nombre = nuevoNombre.trim();
    if (!nombre) {
      setError("Ingresá un nombre para el perfil.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3333/api/perfiles", {
        method: "POST",
        headers: headersAuth,
        body: JSON.stringify({ nombre }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Error al crear perfil");

      setNuevoNombre("");
      await cargarPerfiles();
    } catch (err) {
      setError(err.message || "Error al crear perfil");
    }
  };

  const isOwner = (perfil) => String(perfil.ownerId) === String(userApp?._id);

  const abrirCompartir = (perfilId) => {
    setShareOpenId((prev) => (prev === perfilId ? null : perfilId));
    setShareMsgById((prev) => ({ ...prev, [perfilId]: null }));
  };

  const invitar = async (perfilId) => {
    const email = (shareEmailById[perfilId] || "").trim();

    if (!email) {
      setShareMsgById((prev) => ({
        ...prev,
        [perfilId]: { type: "error", text: "Ingresá un email." },
      }));
      return;
    }

    setSharing(true);
    setShareMsgById((prev) => ({ ...prev, [perfilId]: null }));

    try {
      const res = await fetch(
        `http://localhost:3333/api/perfiles/${perfilId}/invitar`,
        {
          method: "POST",
          headers: headersAuth,
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "No se pudo invitar");

      setShareMsgById((prev) => ({
        ...prev,
        [perfilId]: { type: "ok", text: "✅ Invitación enviada." },
      }));
      setShareEmailById((prev) => ({ ...prev, [perfilId]: "" }));

      await cargarPerfiles();
    } catch (err) {
      setShareMsgById((prev) => ({
        ...prev,
        [perfilId]: { type: "error", text: err.message || "No se pudo invitar" },
      }));
    } finally {
      setSharing(false);
    }
  };
  
const eliminarPerfil = async (id) => {
  if (!window.confirm("¿Seguro que querés eliminar este perfil?")) return;

  try {
    const res = await fetch(`http://localhost:3333/api/perfiles/${id}`, {
      method: "DELETE",
      headers: headersAuth,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || "No se pudo eliminar el perfil");
    }

    alert("Perfil eliminado con éxito ✅");

    await cargarPerfiles(); // refresca lista
  } catch (err) {
    alert(err.message);
  }
};

  if (!userApp) {
    return (
      <main className="mis-vacunas-crear">
        <div className="card-auth">
          <h1 className="card-auth__title">Perfiles</h1>
          <p>No hay sesión activa. Por favor iniciá sesión.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth">
        <h1 className="card-auth__title">Perfiles</h1>

        {/* Crear perfil */}
        <form onSubmit={crearPerfil} className="form-vacuna" style={{ marginBottom: 18 }}>
          <label>
            Nombre del perfil
            <input
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              placeholder="Ej: Bautista"
              required
            />
          </label>

          {error && (
            <p style={{ marginTop: 10, color: "#b00020", fontWeight: 600 }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary-auth" style={{ marginTop: 14 }}>
            Crear perfil
          </button>
        </form>

        {/* Lista */}
        {loading ? (
          <p>Cargando perfiles...</p>
        ) : perfiles.length === 0 ? (
          <p>No hay perfiles todavía.</p>
        ) : (
          <ul className="lista-vacunas">
            {perfiles.map((p) => {
              const owner = isOwner(p);

              return (
                <li key={p._id} className="vacuna-item">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <h3 style={{ marginBottom: 6 }}>{p.nombre}</h3>
                      {!owner && (
                        <p style={{ margin: 0, fontWeight: 700, opacity: 0.75 }}>
                          Compartido
                        </p>
                      )}
                    </div>

                    <div className="btns" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <button
                        type="button"
                        className="btn-editar"
                        onClick={() => navigate("/mis-vacunas")}
                        title="Ver vacunas (elegís el perfil desde el select)"
                      >
                        Ver vacunas
                      </button>

                      {owner && (
                        <>
                          <button
                            type="button"
                            className="btn-editar"
                            onClick={() => abrirCompartir(p._id)}
                          >
                            Compartir
                          </button>

                          <button
                            type="button"
                            className="btn-borrar"
                            onClick={() => eliminarPerfil(p._id)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Panel compartir */}
                  {owner && shareOpenId === p._id && (
                    <div style={{ marginTop: 14 }}>
                      <label style={{ display: "grid", gap: 8 }}>
                        Email del usuario a invitar
                        <div style={{ display: "flex", gap: 10 }}>
                          <input
                            value={shareEmailById[p._id] || ""}
                            onChange={(e) =>
                              setShareEmailById((prev) => ({
                                ...prev,
                                [p._id]: e.target.value,
                              }))
                            }
                            placeholder="test@gmail.com"
                          />
                          <button
                            type="button"
                            className="btn-primary-auth"
                            onClick={() => invitar(p._id)}
                            disabled={sharing}
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {sharing ? "Enviando..." : "Invitar"}
                          </button>
                        </div>
                      </label>

                      {shareMsgById[p._id]?.text && (
                        <p
                          style={{
                            marginTop: 10,
                            fontWeight: 700,
                            color:
                              shareMsgById[p._id].type === "ok"
                                ? "green"
                                : "#b00020",
                          }}
                        >
                          {shareMsgById[p._id].text}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div style={{ marginTop: 18 }}>
          <button className="boton" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    </main>
  );
}