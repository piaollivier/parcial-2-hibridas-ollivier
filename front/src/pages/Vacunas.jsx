import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToken } from "../context/SessionContext";

export default function Vacunas() {
  const token = useToken();
  const [vacunas, setVacunas] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState("todas");

  const cargarVacunas = (filtro = "todas") => {
    let url = "http://localhost:3333/api/vacunas";
    const params = new URLSearchParams();

    if (filtro === "obligatorias") {
      params.append("obligatoria", "true");
    } else if (filtro === "no-obligatorias") {
      params.append("obligatoria", "false");
    }
    // acá podrías seguir agregando:
    // if (filtro === "bebes") params.append("grupo", "Bebés");

    const qs = params.toString();
    if (qs) url += "?" + qs;

    fetch(url, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setVacunas(data))
      .catch(() => console.log("Error en vacunas"));
  };

  useEffect(() => {
    cargarVacunas("todas");
  }, [token]);

  const handleFiltro = (filtro) => {
    setFiltroActivo(filtro);
    cargarVacunas(filtro);
  };

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth" style={{ maxWidth: "900px" }}>
        <h1 className="card-auth__title">Vacunas del calendario</h1>

        {/* Filtros */}
        <div className="vacunas-filtros">
          <button
            className={`btn-filtro ${filtroActivo === "todas" ? "activo" : ""}`}
            onClick={() => handleFiltro("todas")}
          >
            Todas
          </button>
          <button
            className={`btn-filtro ${
              filtroActivo === "obligatorias" ? "activo" : ""
            }`}
            onClick={() => handleFiltro("obligatorias")}
          >
            Obligatorias
          </button>
          <button
            className={`btn-filtro ${
              filtroActivo === "no-obligatorias" ? "activo" : ""
            }`}
            onClick={() => handleFiltro("no-obligatorias")}
          >
            No obligatorias
          </button>
        </div>

        {/* Lista */}
        <ul className="lista-vacunas">
          {vacunas.map((v) => (
            <li key={v._id} className="vacuna-item">
              <h3>{v.nombre}</h3>
              <p>
                <strong>Previene:</strong> {v.previene}
              </p>

              <div className="btns">
                <Link to={`/vacunas/${v._id}`} className="btn-detalle">
                  Ver detalle
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
