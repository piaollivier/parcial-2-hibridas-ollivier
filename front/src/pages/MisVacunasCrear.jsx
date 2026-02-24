import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario, usePerfilActivo } from "../context/SessionContext";

const MisVacunasCrear = () => {
  const navigate = useNavigate();
  const { userApp } = useUsuario();
  const perfilActivo = usePerfilActivo();

  const [modo, setModo] = useState("catalogo");

  const [form, setForm] = useState({
    nombre: "",
    previene: "",
    edad_aplicacion: "",
    dosis: "",
    grupo: "",
    obligatoria: false,
    fecha_colocacion: "",
  });

  const [grupos, setGrupos] = useState([]);

  const [catalogo, setCatalogo] = useState([]);
  const [catalogoId, setCatalogoId] = useState("");

  useEffect(() => {
    fetch("http://localhost:3333/api/grupos")
      .then((res) => res.json())
      .then((data) => setGrupos(Array.isArray(data) ? data : []))
      .catch(() => console.log("Error al obtener grupos"));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3333/api/vacunas")
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        const globales = arr.filter((v) => !v.userId && !v.perfilId);
        setCatalogo(globales);
      })
      .catch(() => console.log("Error al obtener catálogo de vacunas"));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toStringEdad = (value) => {
    if (Array.isArray(value)) return value.join(", ");
    if (value === null || value === undefined) return "";
    return String(value);
  };

  const handleSelectCatalogo = (e) => {
    const id = e.target.value;
    setCatalogoId(id);

    const v = catalogo.find((x) => x._id === id);
    if (!v) return;

    setForm((prev) => ({
      ...prev,
      nombre: v.nombre ?? "",
      previene: v.previene ?? "",
      edad_aplicacion: toStringEdad(v.edad_aplicacion),
      dosis: v.dosis ?? "",
      grupo: v.grupo ?? "",
      obligatoria: !!v.obligatoria,
    }));
  };

  useEffect(() => {
    if (modo === "manual") {
      setCatalogoId("");
      setForm({
        nombre: "",
        previene: "",
        edad_aplicacion: "",
        dosis: "",
        grupo: "",
        obligatoria: false,
        fecha_colocacion: "",
      });
    }

    if (modo === "catalogo") {
      setCatalogoId("");
      setForm((prev) => ({
        ...prev,
        nombre: "",
        previene: "",
        edad_aplicacion: "",
        dosis: "",
        grupo: "",
        obligatoria: false,
      }));
    }
  }, [modo]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ debe existir perfil activo
    if (!perfilActivo?._id) {
      alert("Primero seleccioná un perfil en Mis Vacunas.");
      navigate("/mis-vacunas");
      return;
    }

    // ✅ validación modo catálogo
    if (modo === "catalogo" && !catalogoId) {
      alert("Seleccioná una vacuna del catálogo.");
      return;
    }

    // ✅ validación mínima
    if (!form.grupo) {
      alert("Seleccioná un grupo.");
      return;
    }

    const body = {
      ...form,
      edad_aplicacion: Array.isArray(form.edad_aplicacion)
        ? form.edad_aplicacion.join(", ")
        : String(form.edad_aplicacion || ""),
      perfilId: perfilActivo._id, // ✅ clave del final
      // userId: userApp?._id,     // ❌ ya no hace falta si trabajás por perfil
    };

    fetch("http://localhost:3333/api/vacunas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userApp.token}`,
      },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.log("❌ ERROR BACK FULL >>>", data);
          throw new Error(
            data?.error ||
              data?.message?.[0] ||
              (Array.isArray(data?.message)
                ? data.message.join(" | ")
                : data?.message) ||
              "Error al crear vacuna"
          );
        }

        return data;
      })
      .then(() => navigate("/mis-vacunas"))
      .catch((err) => console.error(err));
  };

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth">
        <h1 className="card-auth__title">Cargar vacuna</h1>

        {/* ✅ Aviso de perfil activo */}
        <p style={{ marginTop: 6, marginBottom: 18, opacity: 0.85 }}>
          Perfil activo:{" "}
          <strong style={{ color: "#1e3a5f" }}>
            {(perfilActivo?.nombre || "").toUpperCase()}
          </strong>
        </p>

        <div className="modo-vacuna">
          <label className={`modo-opcion ${modo === "catalogo" ? "activo" : ""}`}>
            <input
              type="radio"
              name="modo"
              value="catalogo"
              checked={modo === "catalogo"}
              onChange={() => setModo("catalogo")}
            />
            Elegir del catálogo
          </label>

          <label className={`modo-opcion ${modo === "manual" ? "activo" : ""}`}>
            <input
              type="radio"
              name="modo"
              value="manual"
              checked={modo === "manual"}
              onChange={() => setModo("manual")}
            />
            Cargar desde cero
          </label>
        </div>

        <form onSubmit={handleSubmit} className="form-vacuna">
          {modo === "catalogo" && (
            <>
              <label>
                Seleccioná una vacuna
                <select
                  className="input-auth"
                  value={catalogoId}
                  onChange={handleSelectCatalogo}
                >
                  <option value="">— Seleccionar vacuna —</option>
                  {catalogo.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.nombre}
                    </option>
                  ))}
                </select>
              </label>

              {catalogoId && (
                <div className="catalogo-resumen">
                  <p style={{ textAlign: "left" }}>
                    <strong>Previene:</strong> {form.previene || "—"}
                  </p>
                  <p style={{ textAlign: "left" }}>
                    <strong>Edad:</strong> {form.edad_aplicacion || "—"}
                  </p>
                  <p style={{ textAlign: "left" }}>
                    <strong>Dosis:</strong> {form.dosis || "—"}
                  </p>
                </div>
              )}
            </>
          )}

          {modo === "manual" && (
            <>
              <label>
                Nombre de la vacuna
                <input
                  className="input-auth"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Ingresar nombre de la vacuna"
                />
              </label>

              <label>
                Previene
                <input
                  className="input-auth"
                  name="previene"
                  value={form.previene}
                  onChange={handleChange}
                  required
                  placeholder="Ingresar qué previene"
                />
              </label>

              <label>
                Edad de aplicación recomendada
                <input
                  className="input-auth"
                  name="edad_aplicacion"
                  value={form.edad_aplicacion}
                  onChange={handleChange}
                  placeholder="Ingresar edad"
                />
              </label>

              <label>
                Dosis aplicada
                <input
                  className="input-auth"
                  name="dosis"
                  value={form.dosis}
                  onChange={handleChange}
                  placeholder="Ingresar dosis"
                />
              </label>
            </>
          )}

          <label>
            Grupo / categoría
            <select
              className="input-auth"
              name="grupo"
              value={form.grupo}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar grupo</option>
              {grupos.map((g) => (
                <option key={g._id} value={g.nombre}>
                  {g.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha de colocación
            <input
              className="input-auth"
              type="date"
              name="fecha_colocacion"
              value={form.fecha_colocacion}
              onChange={handleChange}
            />
          </label>

          <label className="form-vacuna__checkbox">
            <input
              type="checkbox"
              name="obligatoria"
              checked={form.obligatoria}
              onChange={handleChange}
            />
            Obligatoria
          </label>

          <button type="submit" className="btn-primary-auth">
            Guardar cambios
          </button>

          <div style={{ display: "flex", justifyContent: "start", gap: "16px" }}>
            <button type="button" className="boton" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default MisVacunasCrear;
