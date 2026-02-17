import React from "react";
import { useNavigate } from "react-router-dom";
import { useUsuario } from "../context/SessionContext";

export default function MiPerfil() {
  const navigate = useNavigate();
  const { userApp } = useUsuario();

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${userApp.username || userApp.email}`;


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
        <h1 className="card-auth__title">Mi cuenta</h1>


        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
            textAlign: "center",
            background: "linear-gradient(135deg, #f5f7fa, #e4ecf5)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <img
            src={avatarUrl}
            alt="Avatar usuario"
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #1e3a5f",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",

            }}
          />

          <span
            style={{
              fontWeight: "700",
              fontSize: "1.5rem",
              textTransform: "uppercase",
              color: "#1e3a5f",
              letterSpacing: "1px",
            }}
          >
            {userApp.username || "Usuario"}
          </span>
        </div>


        <div className="perfil-datos">
          <p><strong>Email:</strong> {userApp.email}</p>

          {userApp.nombre && (
            <p><strong>Nombre:</strong> {userApp.nombre}</p>
          )}

          {userApp._id && (
            <p><strong>ID de usuario:</strong> {userApp._id}</p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="boton"
            onClick={() => navigate("/mis-vacunas")}
          >
            Ver mis vacunas
          </button>
        </div>


        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <button className="boton" onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    </main>
  );

}
