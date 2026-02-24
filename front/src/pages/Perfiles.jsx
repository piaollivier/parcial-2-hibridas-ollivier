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

// Perfil activo guardado
const perfilActivoId = useMemo(
() => localStorage.getItem("perfilActivoId") || "",
[]
);

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

  console.log("TOKEN FRONT >>>", userApp.token); // 👈 para ver si llega

  try {
    const res = await fetch("http://localhost:3333/api/perfiles", {
      headers: headersAuth,
    });

    const data = await res.json().catch(() => []);

    if (!res.ok) {
      throw new Error(data?.error || "Error al obtener perfiles");
    }

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

const seleccionarPerfil = (perfil) => {
localStorage.setItem("perfilActivoId", perfil._id);
localStorage.setItem("perfilActivoNombre", perfil.nombre);
// opcional: navegar directo a mis vacunas
// navigate("/mis-vacunas");
// refresco visual sin recargar:
setPerfiles((prev) => [...prev]);
};

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

    if (!res.ok) {
    throw new Error(data?.error || "Error al crear perfil");
    }

    setNuevoNombre("");
    await cargarPerfiles();

    // si no hay perfil activo todavía, setear el nuevo automáticamente
    const activo = localStorage.getItem("perfilActivoId");
    if (!activo) seleccionarPerfil(data);
} catch (err) {
    setError(err.message || "Error al crear perfil");
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
            const esActivo = p._id === perfilActivoId;

            return (
            <li key={p._id} className="vacuna-item">
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                    <h3 style={{ marginBottom: 6 }}>{p.nombre}</h3>

                    <p style={{ margin: 0, opacity: 0.8 }}>
                    {esActivo ? (
                        <strong style={{ color: "#1e3a5f" }}>ACTIVO</strong>
                    ) : (
                        " "
                    )}
                    </p>
                </div>

                <div className="btns" style={{ alignItems: "center" }}>
                    {!esActivo ? (
                    <button
                        type="button"
                        className="btn-editar"
                        onClick={() => seleccionarPerfil(p)}
                    >
                        Seleccionar
                    </button>
                    ) : (
                    <button
                        type="button"
                        className="btn-editar"
                        onClick={() => navigate("/mis-vacunas")}
                    >
                        Ver vacunas
                    </button>
                    )}
                </div>
                </div>
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
