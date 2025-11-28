import React, { useEffect, useState } from "react";
import { useToken } from "../context/SessionContext";

export default function Vacunas() {
  const token = useToken();
  const [vacunas, setVacunas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3333/api/vacunas", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => setVacunas(data))
      .catch(() => console.log("Error en vacunas"));
  }, []);

  return (
    <main>
      <h1>Vacunas</h1>
      <ul>
        {vacunas.map((v) => (
          <li key={v._id}>
            {v.nombre} — {v.previene}
          </li>
        ))}
      </ul>
    </main>
  );
}
