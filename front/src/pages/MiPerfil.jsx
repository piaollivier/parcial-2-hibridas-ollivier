// src/views/MiPerfil.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../context/SessionContext";

export default function MiPerfil() {
  const navigate = useNavigate();
  const { userApp } = useUsuario();

  if (!userApp) {
    return (
      <main className="mis-vacunas-crear">
        <div className="card-auth">
          <h1 className="card-auth__title">Mi cuenta</h1>
          <p>No hay sesión activa. Por favor iniciá sesión.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mis-vacunas-crear">
      <div className="card-auth">
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: "16px",
            marginBottom: "12px",
          }}
        >
          <button className="boton" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>

        <h1 className="card-auth__title">Mi cuenta</h1>

        <div className="perfil-datos">
          <p><strong>Email:</strong> {userApp.email}</p>

          {userApp.nombre && (
            <p><strong>Nombre:</strong> {userApp.nombre}</p>
          )}

          {userApp.username && (
            <p><strong>Nombre de usuario:</strong> {userApp.username ?? "No tiene nombre de usuario"}</p>
          )}

          {userApp._id && (
            <p><strong>ID de usuario:</strong> {userApp._id}</p>
          )}

          {/* Si tenés algún otro campo que quieras mostrar, lo podés sumar acá */}
        </div>
      </div>
    </main>
  );
}
