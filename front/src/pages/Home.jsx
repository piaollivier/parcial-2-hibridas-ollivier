import { Link } from "react-router-dom";
import VacunasHomeImg from "../assets/vacunas-home.png";

export default function Home() {
  return (
    <main
      className="mis-vacunas-crear"
      style={{
        paddingTop: "60px",
        paddingBottom: "60px",
      }}
    >
      <div
        className="card-auth"
        style={{
          maxWidth: "1000px",
          padding: "50px", // MÁS ESPACIO INTERNO
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px", // MÁS ESPACIO ENTRE TEXTO E IMAGEN
          alignItems: "center",
          minHeight: "420px", // LEVANTA VISUALMENTE LA CARD
        }}
      >
        {/* COLUMNA IZQUIERDA — TEXTO */}
        <div>
          <h1
            className="card-auth__title"
            style={{ marginBottom: "24px", textAlign: "left" }}
          >
            Bienvenidos a Mistomed Vacunas
          </h1>

          <p style={{ fontSize: "1.05rem", lineHeight: "1.7", marginBottom: "18px" }}>
            Consultá de manera clara y rápida todas las vacunas del{" "}
            <strong>Calendario Nacional de Vacunación</strong>, con sus edades
            recomendadas y grupos específicos.
          </p>

          <p style={{ fontSize: "1.05rem", lineHeight: "1.7", marginBottom: "18px" }}>
            Además, podés llevar una <strong>gestión personal</strong> de tu carnet,
            registrando tus vacunas, dosis, fechas y toda la información necesaria
            para mantener tu historial al día.
          </p>

          <p style={{ fontSize: "1.05rem", lineHeight: "1.7" }}>
            Mistomed combina información oficial con tu registro personal para que
            puedas tener tu salud <strong>siempre organizada</strong> y accesible.
          </p>

          {/* BOTÓN */}
          <div style={{ marginTop: "30px" }}>
            <Link to="/vacunas" className="btn-primary-auth">
              Ver todas las vacunas
            </Link>
          </div>
        </div>

        {/* COLUMNA DERECHA — IMAGEN */}
        <img
          src={VacunasHomeImg}
          alt="Calendario de vacunación"
          style={{
            width: "100%",
            borderRadius: "16px",
            objectFit: "cover",
          }}
        />
      </div>
    </main>
  );
}
