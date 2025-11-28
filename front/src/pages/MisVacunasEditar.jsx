// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useToken } from "../context/SessionContext";
// import { useUsuario } from "../context/SessionContext";

// const MisVacunasEditar = () => {
// const token = useToken();
// const navigate = useNavigate();
// const { id } = useParams();

// const [form, setForm] = useState({
// nombre: "",
// previene: "",
// edad_aplicacion: "",
// dosis: "",
// grupo: "",
// obligatoria: false,
// });

// // Cargar datos actuales de la vacuna
// useEffect(() => {
// fetch(`http://localhost:3333/api/vacunas/${id}`, {
//     headers: {
//     "Content-Type": "application/json",
//     "Authorization":  `Bearer ${token}`
//     },
// })
//     .then((res) => {
//     if (!res.ok) throw new Error("Error al obtener vacuna");
//     return res.json();
//     })
//     .then((data) => {
//     setForm({
//         nombre: data.nombre || "",
//         previene: data.previene || "",
//         edad_aplicacion: data.edad_aplicacion || "",
//         dosis: data.dosis || "",
//         grupo: data.grupo || "",
//         obligatoria: Boolean(data.obligatoria),
//     });
//     })
//     .catch((err) => console.error(err));
// }, [id, token]);

// const handleChange = (e) => {
// const { name, value, type, checked } = e.target;
// setForm({
//     ...form,
//     [name]: type === "checkbox" ? checked : value,
// });
// };

// const handleSubmit = (e) => {
// e.preventDefault();

// fetch(`http://localhost:3333/api/vacunas/${id}`, {
//     method: "PUT", // usa reemplazarVacuna del controller
//     headers: {
//     "Content-Type": "application/json",
//     "Authorization":  `Bearer ${token}`
//     },
//     body: JSON.stringify(form),
// })
//     .then((res) => {
//     if (!res.ok) throw new Error("Error al editar vacuna");
//     return res.json();
//     })
//     .then(() => navigate("/mis-vacunas"))
//     .catch((err) => console.error(err));
// };

// return (
// <main className="mis-vacunas-editar">
//     <h1>Editar vacuna</h1>

//     <form onSubmit={handleSubmit} className="form-vacuna">
//     <label>
//         Nombre
//         <input
//         name="nombre"
//         value={form.nombre}
//         onChange={handleChange}
//         required
//         />
//     </label>

//     <label>
//         Previene
//         <input
//         name="previene"
//         value={form.previene}
//         onChange={handleChange}
//         required
//         />
//     </label>

//     <label>
//         Edad de aplicación
//         <input
//         name="edad_aplicacion"
//         value={form.edad_aplicacion}
//         onChange={handleChange}
//         required
//         />
//     </label>

//     <label>
//         Dosis
//         <input
//         name="dosis"
//         value={form.dosis}
//         onChange={handleChange}
//         required
//         />
//     </label>

//     <label>
//         Grupo
//         <input
//         name="grupo"
//         value={form.grupo}
//         onChange={handleChange}
//         />
//     </label>

//     <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//         <input
//         type="checkbox"
//         name="obligatoria"
//         checked={form.obligatoria}
//         onChange={handleChange}
//         />
//         Obligatoria
//     </label>

//     <button type="submit">Guardar cambios</button>
//     </form>
// </main>
// );
// };

// export default MisVacunasEditar;








// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useToken, useUsuario } from "../context/SessionContext";

// const MisVacunasEditar = () => {
//   const token = useToken();
//   const { userApp } = useUsuario();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const [form, setForm] = useState({
//     nombre: "",
//     previene: "",
//     edad_aplicacion: "",
//     dosis: "",
//     grupo: "",
//     obligatoria: false,
//   });

//   useEffect(() => {
//     if (!userApp?._id) return;

//     fetch(
//       `http://localhost:3333/api/vacunas/${id}?userId=${encodeURIComponent(
//         userApp._id
//       )}`,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     )
//       .then((res) => {
//         if (!res.ok) throw new Error("Error al obtener vacuna");
//         return res.json();
//       })
//       .then((data) => {
//         setForm({
//           nombre: data.nombre || "",
//           previene: data.previene || "",
//           edad_aplicacion: data.edad_aplicacion || "",
//           dosis: data.dosis || "",
//           grupo: data.grupo || "",
//           obligatoria: Boolean(data.obligatoria),
//         });
//       })
//       .catch((err) => console.error(err));
//   }, [id, token, userApp]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     fetch(`http://localhost:3333/api/vacunas/${id}?userId=${userApp._id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(form),
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Error al editar vacuna");
//         return res.json();
//       })
//       .then(() => navigate("/mis-vacunas"))
//       .catch((err) => console.error(err));
//   };

//   return (
//     <main className="mis-vacunas-editar">
//       <h1>Editar vacuna</h1>

//       <form onSubmit={handleSubmit} className="form-vacuna">
//         <label>
//           Nombre
//           <input name="nombre" value={form.nombre} onChange={handleChange} required />
//         </label>

//         <label>
//           Previene
//           <input name="previene" value={form.previene} onChange={handleChange} required />
//         </label>

//         <label>
//           Edad de aplicación
//           <input
//             name="edad_aplicacion"
//             value={form.edad_aplicacion}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Dosis
//           <input name="dosis" value={form.dosis} onChange={handleChange} required />
//         </label>

//         <label>
//           Grupo
//           <input name="grupo" value={form.grupo} onChange={handleChange} />
//         </label>

//         <label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//           <input
//             type="checkbox"
//             name="obligatoria"
//             checked={form.obligatoria}
//             onChange={handleChange}
//           />
//           Obligatoria
//         </label>

//         <button type="submit">Guardar cambios</button>
//       </form>
//     </main>
//   );
// };

// export default MisVacunasEditar;


// src/views/MisVacunasEditar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUsuario } from "../context/SessionContext";

const MisVacunasEditar = () => {
  const navigate = useNavigate();
  const { id } = useParams();          // viene de la URL /mis-vacunas/editar/:id
  const { userApp } = useUsuario();

  const [form, setForm] = useState({
    nombre: "",
    previene: "",
    edad_aplicacion: "",
    dosis: "",
    grupo: "",
    obligatoria: false,
    fecha_colocacion: "",
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // 1) Traer la vacuna a editar
  useEffect(() => {
    if (!userApp?._id) return; // por las dudas

    fetch(`http://localhost:3333/api/vacunas/${id}?userId=${userApp._id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar vacuna");
        return res.json();
      })
      .then((data) => {
        setForm({
          nombre: data.nombre || "",
          previene: data.previene || "",
          edad_aplicacion: data.edad_aplicacion || "",
          dosis: data.dosis || "",
          grupo: data.grupo || "",
          obligatoria: !!data.obligatoria,
          // el input date necesita formato YYYY-MM-DD
          fecha_colocacion: data.fecha_colocacion
            ? data.fecha_colocacion.slice(0, 10)
            : "",
        });
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar la vacuna");
        setCargando(false);
      });
  }, [id, userApp]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 2) Enviar edición (PUT → reemplazarVacuna)
  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      ...form,
      // acá NO hace falta userId en el body,
      // porque tu controller usa req.query.userId
    };

    fetch(
      `http://localhost:3333/api/vacunas/${id}?userId=${userApp._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error al editar vacuna");
        return res.json();
      })
      .then(() => navigate("/mis-vacunas"))
      .catch((err) => {
        console.error(err);
        setError("No se pudo guardar la edición");
      });
  };

  if (cargando) return <p>Cargando vacuna...</p>;
  if (error) return <p>{error}</p>;

  return (
<main className="mis-vacunas-crear">
  <div className="card-auth">

    {/* Botón volver */}
    <div
      style={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <button className="boton" onClick={() => navigate(-1)}>
       ⬅️ Volver
      </button>
    </div>

    {/* Título igual al crear */}
    <h1 className="card-auth__title">Editar vacuna</h1>

    <form onSubmit={handleSubmit} className="form-vacuna">
      <label>
        Nombre de la vacuna
        <input
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
          name="edad_aplicacion"
          value={form.edad_aplicacion}
          onChange={handleChange}
          placeholder="Ingresar edad"
        />
      </label>

      <label>
        Dosis aplicada
        <input
          name="dosis"
          value={form.dosis}
          onChange={handleChange}
          placeholder="Ingresar dosis"
        />
      </label>

      <label>
        Grupo / categoría
        <input
          name="grupo"
          value={form.grupo}
          onChange={handleChange}
          placeholder="Ingresar grupo"
        />
      </label>

      <label>
        Fecha de colocación
        <input
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
    </form>
  </div>
</main>

  );
};

export default MisVacunasEditar;
