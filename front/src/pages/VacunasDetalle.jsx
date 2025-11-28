import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToken } from "../context/SessionContext";

const VacunasDetalle = () => {
const { id } = useParams();
const [vacuna, setVacuna] = useState(null);
const token = useToken();          
const navigate = useNavigate();

useEffect(() => {
if (!id) {
    console.error("No llegó el id en useParams");
    return;
}

const url = `http://localhost:3333/api/vacunas/${id}`;
console.log("URL detalle vacuna:", url);
console.log("TOKEN:", token);

fetch(url, {
    method: "GET",
    headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + (token ?? ""),
    },
})
    .then((res) => res.json())
    .then((data) => setVacuna(data))
    .catch((error) => console.error("Error en detalle:", error));
}, [id, token]); 

if (!vacuna) return <p className="loading">Cargando...</p>;

return (
<main className="card detalle-container">
    <div className="volver-wrapper">
    <button className="volver-btn" onClick={() => navigate(-1)}>
        ← Volver
    </button>
    </div>

    <div className="detalle-card-grid">
    <div className="detalle-img-col">
        <img
        src={`http://localhost:3333${vacuna.imagen}`}
        alt={vacuna.nombre}
        className="detalle-img"
        />
    </div>

    <div className="detalle-info-col">
        <h2 className="detalle-title">{vacuna.nombre}</h2>

        <p className="detalle-text">
        <strong>Previene:</strong> {vacuna.previene}
        </p>

        <p className="detalle-text">
        <strong>Edad de aplicación:</strong>{" "}
        {vacuna.edad_aplicacion?.join(", ")}
        </p>

        <p className="detalle-text">
        <strong>Dosis:</strong> {vacuna.dosis}
        </p>

        <p className="detalle-text">
        <strong>Grupo etario:</strong> {vacuna.grupo}
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
