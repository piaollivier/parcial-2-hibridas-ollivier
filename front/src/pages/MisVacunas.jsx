// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useUsuario } from "../context/SessionContext";

// export default function MisVacunas() {
//   const userApp = useUsuario();
//   const [vacunas, setVacunas] = useState([]);

//   const obtenerMisVacunas = () => {
//     if (!userApp?.email) return;

//     fetch(
//       `http://localhost:3333/api/vacunas?emailUsuario=${encodeURIComponent(
//         userApp.email
//       )}`
//     )
//       .then((res) => res.json())
//       .then((data) => setVacunas(data))
//       .catch(() => console.log("Error al obtener mis vacunas"));
//   };

//   useEffect(() => {
//     obtenerMisVacunas();
//   }, [userApp?.email]);

//   const eliminarVacuna = (id) => {
//     fetch(`http://localhost:3333/api/vacunas/${id}`, {
//       method: "DELETE",
//     })
//       .then(() => obtenerMisVacunas())
//       .catch(() => console.log("Error al eliminar vacuna"));
//   };

//   return (
//     <main className="mis-vacunas-container">
//       <h1>Mis Vacunas</h1>

//       <div style={{ marginBottom: "20px" }}>
//         <Link to="/mis-vacunas/nueva" className="btn-crear">
//           Crear nueva vacuna
//         </Link>
//       </div>

//       {vacunas.length === 0 ? (
//         <p>No tenés vacunas cargadas.</p>
//       ) : (
//         <ul className="lista-vacunas">
//           {vacunas.map((v) => (
//             <li key={v._id} className="vacuna-item">
//               <h3>{v.nombre}</h3>
//               <p>
//                 <strong>Previene:</strong> {v.previene}
//               </p>
//               <p>
//                 <strong>Edad:</strong> {v.edad_aplicacion}
//               </p>
//               <p>
//                 <strong>Dosis:</strong> {v.dosis}
//               </p>
//               <p>
//                 <strong>Grupo:</strong> {v.grupo}
//               </p>
//               <p>
//                 <strong>Obligatoria:</strong> {v.obligatoria ? "Sí" : "No"}
//               </p>

//               <div className="btns">
//                 <button
//                   onClick={() => eliminarVacuna(v._id)}
//                   className="btn-borrar"
//                 >
//                   Eliminar
//                 </button>

//                 <Link
//                   to={`/mis-vacunas/editar/${v._id}`}
//                   className="btn-editar"
//                 >
//                   Editar
//                 </Link>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </main>
//   );
// }




// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useUsuario } from "../context/SessionContext";

// export default function MisVacunas() {
//   const { userApp } = useUsuario();   // ✅ FIX
//   const [vacunas, setVacunas] = useState([]);

//   const obtenerMisVacunas = () => {
//     if (!userApp?._id) return;   // ⬅️ AHORA FILTRAMOS POR ID, NO POR EMAIL

//     fetch(`http://localhost:3333/api/vacunas?userId=${userApp._id}`)
//       .then((res) => res.json())
//       .then((data) => setVacunas(data))
//       .catch(() => console.log("Error al obtener mis vacunas"));
//   };

//   useEffect(() => {
//     obtenerMisVacunas();
//   }, [userApp?._id]);

//   const eliminarVacuna = (id) => {
//     fetch(`http://localhost:3333/api/vacunas/${id}`, {
//       method: "DELETE",
//     })
//       .then(() => obtenerMisVacunas())
//       .catch(() => console.log("Error al eliminar vacuna"));
//   };

//   return (
//     <main className="mis-vacunas-container">
//       <h1>Mis Vacunas</h1>

//       <div style={{ marginBottom: "20px" }}>
//         <Link to="/mis-vacunas/nueva" className="btn-crear">
//           Crear nueva vacuna
//         </Link>
//       </div>

//       {vacunas.length === 0 ? (
//         <p>No tenés vacunas cargadas.</p>
//       ) : (
//         <ul className="lista-vacunas">
//           {vacunas.map((v) => (
//             <li key={v._id} className="vacuna-item">
//               <h3>{v.nombre}</h3>
//               <p><strong>Previene:</strong> {v.previene}</p>
//               <p><strong>Edad:</strong> {v.edad_aplicacion}</p>
//               <p><strong>Dosis:</strong> {v.dosis}</p>
//               <p><strong>Grupo:</strong> {v.grupo}</p>
//               <p><strong>Obligatoria:</strong> {v.obligatoria ? "Sí" : "No"}</p>

//               <div className="btns">
//                 <button onClick={() => eliminarVacuna(v._id)} className="btn-borrar">
//                   Eliminar
//                 </button>

//                 <Link to={`/mis-vacunas/editar/${v._id}`} className="btn-editar">
//                   Editar
//                 </Link>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </main>
//   );
// }


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUsuario } from "../context/SessionContext";

export default function MisVacunas() {
  const { userApp } = useUsuario();
  const [vacunas, setVacunas] = useState([]);

  const obtenerMisVacunas = () => {
    if (!userApp?._id) return;

    fetch(`http://localhost:3333/api/vacunas?userId=${userApp._id}`)
      .then((res) => res.json())
      .then((data) => {
        // 👇 Ocultamos las vacunas con borrado lógico
        const activas = data.filter((v) => !v.deleted);
        setVacunas(activas);
      })
      .catch(() => console.log("Error al obtener mis vacunas"));
  };

  useEffect(() => {
    obtenerMisVacunas();
  }, [userApp?._id]);

  const eliminarVacuna = (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar esta vacuna?"
    );
    if (!confirmar) return;

    fetch(
      `http://localhost:3333/api/vacunas/${id}?userId=${userApp._id}`,
      {
        method: "DELETE",
      }
    )
      .then(() => obtenerMisVacunas())
      .catch(() => console.log("Error al eliminar vacuna"));
  };

  return (
    <main className="mis-vacunas-container">
      <h1>Mis Vacunas</h1>

      <div  style={{ marginBottom: "20px" }}>
        <Link to="/mis-vacunas/nueva" className="btn-crear boton">
          Crear nueva vacuna
        </Link>
      </div>
    
      {vacunas.length === 0 ? (
        <p>No tenés vacunas cargadas.</p>
      ) : (
        <ul className="lista-vacunas">
          {vacunas.map((v) => (
            <li key={v._id} className="vacuna-item">
              <h3>{v.nombre}</h3>
              <p>
                <strong>Previene:</strong> {v.previene}
              </p>
              <p>
                <strong>Edad:</strong> {v.edad_aplicacion}
              </p>
              <p>
                <strong>Dosis:</strong> {v.dosis}
              </p>
              <p>
                <strong>Grupo:</strong> {v.grupo}
              </p>
              <p>
                <strong>Obligatoria:</strong> {v.obligatoria ? "Sí" : "No"}
              </p>

              <div className="btns">
                <button
                  onClick={() => eliminarVacuna(v._id)}
                  className="btn-borrar"
                >
                  Eliminar
                </button>

                <Link
                  to={`/mis-vacunas/editar/${v._id}`}
                  className="btn-editar"
                >
                  Editar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
