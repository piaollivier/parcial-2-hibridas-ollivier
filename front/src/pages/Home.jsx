import { Link } from "react-router-dom";
import VacunasHomeImg from "../assets/vacunas-home.png";

export default function Home() {
  return (
    <main className="home-main">
      <div className="home-container">

        <section className="card-auth home-section">
          <h1 className="card-auth__title home-title">
            Bienvenidos a MistoMed
          </h1>

          <div className="home-hero">
            <div>
              <img
                src={VacunasHomeImg}
                alt="Calendario de vacunación"
                className="home-image"
              />
            </div>

            <div>
              <div className="home-text">
                <p className="home-p-first">
                  Consultá de forma clara y rápida las vacunas del{" "}
                  <strong>Calendario Nacional de Vacunación</strong>, con edades
                  recomendadas, dosis y grupos específicos.
                </p>

                <p className="home-p">
                  Además, podés llevar tu <strong>registro personal</strong>:
                  cargar vacunas aplicadas, fechas, dosis y observaciones para
                  mantener tu historial al día.
                </p>

                <p className="home-p">
                  MistoMed combina información confiable con tu carnet digital
                  para que tengas tu salud <strong>organizada</strong> y accesible
                  cuando la necesites.
                </p>
              </div>

              <div className="home-buttons">
                <Link to="/vacunas" className="btn-primary-auth btn-small">
                  Ver calendario
                </Link>

                <Link to="/mis-vacunas" className="btn-primary-auth btn-small">
                  Ir a Mis Vacunas
                </Link>
              </div>
            </div>
          </div>

          <p className="home-tip">
            Tip: desde <strong>Perfiles</strong> podés crear miembros (hijos/familia) y registrar vacunas para cada uno.
          </p>
        </section>

        <section className="card-auth home-section">
          <h2 className="card-auth__title home-subtitle">
            ¿Qué podés hacer en MistoMed?
          </h2>

          <div className="home-grid-benefits">
            <div className="home-card-soft">
              <h3 className="home-card-title">Consultar</h3>
              <p>
                Accedé al calendario y encontrá vacunas por nombre, dosis, edad y prevención.
              </p>
            </div>

            <div className="home-card-soft">
              <h3 className="home-card-title">Registrar</h3>
              <p>
                Guardá tus vacunas aplicadas con fecha, dosis e imagen para tener el historial completo.
              </p>
            </div>

            <div className="home-card-soft">
              <h3 className="home-card-title">Organizar</h3>
              <p>
                Usá perfiles para separar la información por persona y mantener todo claro y ordenado.
              </p>
            </div>
          </div>
        </section>

        <section className="card-auth home-section">
          <h2 className="card-auth__title home-subtitle">
            ¿Cómo funciona?
          </h2>

          <div className="home-grid-steps">
            <div className="home-card-border">
              <div className="home-step-circle">1</div>
              <h3 className="home-card-title">Crear perfiles</h3>
              <p>
                Agregá tus miembros (vos, hijos, familia) para registrar vacunas por cada uno.
              </p>
            </div>

            <div className="home-card-border">
              <div className="home-step-circle">2</div>
              <h3 className="home-card-title">Explorar el calendario</h3>
              <p>
                Consultá la info oficial: edades, dosis, prevención y detalles importantes.
              </p>
            </div>

            <div className="home-card-border">
              <div className="home-step-circle">3</div>
              <h3 className="home-card-title">Registrar tus vacunas</h3>
              <p>
                Guardá tu aplicación con fecha, dosis e imagen para tener tu carnet actualizado.
              </p>
            </div>
          </div>

          <div className="home-buttons-access">
            <Link to="/perfiles" className="btn-primary-auth btn-small">
              Ir a Perfiles
            </Link>

            <Link to="/mis-vacunas" className="btn-primary-auth btn-small">
              Ir a Mis Vacunas
            </Link>

            <Link to="/grupos" className="btn-primary-auth btn-small">
              Ver Grupos
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}