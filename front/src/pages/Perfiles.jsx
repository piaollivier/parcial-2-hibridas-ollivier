import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../context/SessionContext";

export default function Perfiles() {
  const navegar = useNavigate();
  const { userApp } = useUsuario();

  const [listaPerfiles, setListaPerfiles] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ✅ form completo crear perfil (lo dejás por si lo usás después)
  const [formularioPerfil, setFormularioPerfil] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    dni: "",
    grupoSanguineo: "",
    factor: "",
    telefono: "",
  });

  const [mensajeError, setMensajeError] = useState("");

  // ✅ compartir
  const [idPerfilCompartirAbierto, setIdPerfilCompartirAbierto] = useState(null);
  const [emailPorPerfilId, setEmailPorPerfilId] = useState({});
  const [mensajePorPerfilId, setMensajePorPerfilId] = useState({});
  const [estaEnviandoInvitacion, setEstaEnviandoInvitacion] = useState(false);

  const headersConToken = useMemo(() => {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userApp?.token}`,
    };
  }, [userApp?.token]);

  const traerPerfiles = async () => {
    if (!userApp?.token) {
      setCargando(false);
      setListaPerfiles([]);
      setMensajeError("No hay token en sesión. Cerrá sesión y volvé a loguearte.");
      return;
    }

    setCargando(true);
    setMensajeError("");

    try {
      const respuesta = await fetch("http://localhost:3333/api/perfiles", {
        headers: headersConToken,
      });

      const datos = await respuesta.json().catch(() => []);
      if (!respuesta.ok) throw new Error(datos?.error || "Error al obtener perfiles");

      setListaPerfiles(Array.isArray(datos) ? datos : []);
    } catch (err) {
      setMensajeError(err?.message || "Error al obtener perfiles");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    traerPerfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userApp?.token]);

  const cuandoCambiaInput = (e) => {
    const { name, value } = e.target;
    setFormularioPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const guardarNuevoPerfil = async (e) => {
    e.preventDefault();
    setMensajeError("");

    const datosAEnviar = {
      nombre: formularioPerfil.nombre.trim(),
      apellido: formularioPerfil.apellido.trim(),
      fechaNacimiento: formularioPerfil.fechaNacimiento,
      dni: String(formularioPerfil.dni || "").trim(),
      grupoSanguineo: formularioPerfil.grupoSanguineo,
      factor: formularioPerfil.factor,
      telefono: String(formularioPerfil.telefono || "").trim(),
    };

    if (!datosAEnviar.nombre) return setMensajeError("Nombre requerido");
    if (!datosAEnviar.dni) return setMensajeError("DNI requerido");
    if (!datosAEnviar.fechaNacimiento)
      return setMensajeError("Fecha de nacimiento requerida");

    try {
      const respuesta = await fetch("http://localhost:3333/api/perfiles", {
        method: "POST",
        headers: headersConToken,
        body: JSON.stringify(datosAEnviar),
      });

      const datos = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok) throw new Error(datos?.error || "Error al crear perfil");

      setFormularioPerfil({
        nombre: "",
        apellido: "",
        fechaNacimiento: "",
        dni: "",
        grupoSanguineo: "",
        factor: "",
        telefono: "",
      });

      await traerPerfiles();
    } catch (err) {
      setMensajeError(err?.message || "Error al crear perfil");
    }
  };

  const esDueno = (perfil) => String(perfil.ownerId) === String(userApp?._id);

  // ✅ separar en 2 listas
  const perfilesMios = useMemo(() => {
    return listaPerfiles.filter((p) => esDueno(p));
  }, [listaPerfiles, userApp?._id]);

  const perfilesCompartidos = useMemo(() => {
    return listaPerfiles.filter((p) => !esDueno(p));
  }, [listaPerfiles, userApp?._id]);

  // ✅ quién lo compartió (depende del back, ponemos fallback)
  const nombreDeQuienComparte = (perfil) => {
    return (
      perfil?.ownerNombre ||
      perfil?.ownerUsername ||
      perfil?.ownerEmail ||
      "Usuario"
    );
  };

  const abrirSeccionCompartir = (perfilId) => {
    setIdPerfilCompartirAbierto((prev) => (prev === perfilId ? null : perfilId));
    setMensajePorPerfilId((prev) => ({ ...prev, [perfilId]: null }));
  };

  const enviarInvitacion = async (perfilId) => {
    const email = (emailPorPerfilId[perfilId] || "").trim();

    if (!email) {
      setMensajePorPerfilId((prev) => ({
        ...prev,
        [perfilId]: { type: "error", text: "Ingresá un email." },
      }));
      return;
    }

    setEstaEnviandoInvitacion(true);
    setMensajePorPerfilId((prev) => ({ ...prev, [perfilId]: null }));

    try {
      const respuesta = await fetch(
        `http://localhost:3333/api/perfiles/${perfilId}/invitar`,
        {
          method: "POST",
          headers: headersConToken,
          body: JSON.stringify({ email }),
        }
      );

      const datos = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok) throw new Error(datos?.error || "No se pudo invitar");

      setMensajePorPerfilId((prev) => ({
        ...prev,
        [perfilId]: { type: "ok", text: "✅ Invitación enviada." },
      }));

      setEmailPorPerfilId((prev) => ({ ...prev, [perfilId]: "" }));
      await traerPerfiles();
    } catch (err) {
      setMensajePorPerfilId((prev) => ({
        ...prev,
        [perfilId]: {
          type: "error",
          text: err?.message || "No se pudo invitar",
        },
      }));
    } finally {
      setEstaEnviandoInvitacion(false);
    }
  };

  const borrarPerfil = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este perfil?")) return;

    try {
      const respuesta = await fetch(`http://localhost:3333/api/perfiles/${id}`, {
        method: "DELETE",
        headers: headersConToken,
      });

      const datos = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok) throw new Error(datos?.error || "No se pudo eliminar el perfil");

      alert("Perfil eliminado con éxito ✅");
      await traerPerfiles();
    } catch (err) {
      alert(err?.message || "No se pudo eliminar el perfil");
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
        {/* ✅ Título + botón */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h1 className="card-auth__title" style={{ margin: 0 }}>
            Perfiles
          </h1>

          <button
            className="btn-primary-auth"
            onClick={() => navegar("/perfiles/nuevo")}
            style={{ width: "auto", padding: "8px 18px" }}
          >
            + Nuevo perfil
          </button>
        </div>

        {mensajeError && (
          <p style={{ marginTop: 0, marginBottom: 14, color: "#b00020", fontWeight: 700 }}>
            {mensajeError}
          </p>
        )}

        {/* ✅ Lista */}
        {cargando ? (
          <p>Cargando perfiles...</p>
        ) : listaPerfiles.length === 0 ? (
          <p>No hay perfiles todavía.</p>
        ) : (
          <>
            {/* ===== MIS PERFILES ===== */}
            <h2 style={{ margin: "10px 0 12px", fontSize: 18, opacity: 0.9 }}>
              Mis perfiles
            </h2>

            {perfilesMios.length === 0 ? (
              <p style={{ marginTop: 0, opacity: 0.75 }}>
                Todavía no creaste perfiles.
              </p>
            ) : (
              <ul className="lista-vacunas" style={{ marginTop: 0 }}>
                {perfilesMios.map((perfil) => (
                  <li key={perfil._id} className="vacuna-item">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <div className="perfil-header">
                        <img
                          src={perfil.avatar}
                          alt="avatar"
                          className="perfil-avatar"
                        />

                        <div>
                          <p className="perfil-nombre">{perfil.nombre}</p>
                          {perfil.apellido && (
                            <p className="perfil-apellido">{perfil.apellido}</p>
                          )}
                        </div>
                      </div>
                      <div
                        className="btns"
                        style={{ display: "flex", gap: 10, alignItems: "center" }}
                      >
                        <button
                          type="button"
                          className="btn-editar"
                          onClick={() => navegar("/mis-vacunas")}
                          title="Ver vacunas (elegís el perfil desde el select)"
                        >
                          Ver vacunas
                        </button>

                        <button
                          type="button"
                          className="btn-editar"
                          onClick={() => navegar(`/perfiles/${perfil._id}`)}
                        >
                          Ver
                        </button>

                        <button
                          type="button"
                          className="btn-editar"
                          onClick={() => abrirSeccionCompartir(perfil._id)}
                        >
                          Compartir
                        </button>

                        <button
                          type="button"
                          className="btn-borrar"
                          onClick={() => borrarPerfil(perfil._id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    {/* ✅ Panel compartir */}
                    {idPerfilCompartirAbierto === perfil._id && (
                      <div style={{ marginTop: 14 }}>
                        <label style={{ display: "grid", gap: 8 }}>
                          Email del usuario a invitar
                          <div style={{ display: "flex", gap: 10 }}>
                            <input
                              value={emailPorPerfilId[perfil._id] || ""}
                              onChange={(e) =>
                                setEmailPorPerfilId((prev) => ({
                                  ...prev,
                                  [perfil._id]: e.target.value,
                                }))
                              }
                              placeholder="ejemplo@gmail.com"
                            />
                            <button
                              type="button"
                              className="btn-primary-auth"
                              onClick={() => enviarInvitacion(perfil._id)}
                              disabled={estaEnviandoInvitacion}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              {estaEnviandoInvitacion ? "Enviando..." : "Invitar"}
                            </button>
                          </div>
                        </label>

                        {mensajePorPerfilId[perfil._id]?.text && (
                          <p
                            style={{
                              marginTop: 10,
                              fontWeight: 700,
                              color:
                                mensajePorPerfilId[perfil._id].type === "ok"
                                  ? "green"
                                  : "#b00020",
                            }}
                          >
                            {mensajePorPerfilId[perfil._id].text}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* ===== COMPARTIDOS CONMIGO ===== */}
            <h2 style={{ margin: "22px 0 12px", fontSize: 18, opacity: 0.9 }}>
              Compartidos conmigo
            </h2>

            {perfilesCompartidos.length === 0 ? (
              <p style={{ marginTop: 0, opacity: 0.75 }}>
                Nadie te compartió perfiles todavía.
              </p>
            ) : (
              <ul className="lista-vacunas" style={{ marginTop: 0 }}>
                {perfilesCompartidos.map((perfil) => (
                  <li key={perfil._id} className="vacuna-item">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <div>
                        {/* <h3 style={{ marginBottom: 6 }}>
                          {perfil.nombre} {perfil.apellido ? perfil.apellido : ""}
                        </h3> */}
                        <div className="perfil-header">
                          <img
                            src={perfil.avatar}
                            alt="avatar"
                            className="perfil-avatar"
                          />

                          <div>
                            <p className="perfil-nombre">{perfil.nombre}</p>
                            {perfil.apellido && (
                              <p className="perfil-apellido">{perfil.apellido}</p>
                            )}
                          </div>
                        </div>

                        <p style={{ marginTop: 20, color: "#888", fontSize: "13px" }}>
                          Compartido por: {nombreDeQuienComparte(perfil)}
                        </p>
                      </div>

                      <div
                        className="btns"
                        style={{ display: "flex", gap: 10, alignItems: "center" }}
                      >
                        <button
                          type="button"
                          className="btn-editar"
                          onClick={() => navegar("/mis-vacunas")}
                          title="Ver vacunas (elegís el perfil desde el select)"
                        >
                          Ver vacunas
                        </button>

                        <button
                          type="button"
                          className="btn-editar"
                          onClick={() => navegar(`/perfiles/${perfil._id}`)}
                        >
                          Ver
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div style={{ marginTop: 18 }}>
          <button className="boton" onClick={() => navegar(-1)}>
            Volver
          </button>
        </div>
      </div>
    </main>
  );
}