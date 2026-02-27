import { Link } from "react-router-dom";
import { useUsuario, useLogout } from "../context/SessionContext";

export default function Nav() {
  const { userApp } = useUsuario();
  const logout = useLogout();

  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${userApp?.username || userApp?.email}`;


  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="navbar-logo">
          <Link to="/">Mistomed</Link>
        </div>

        <div className="navbar-links">

          <Link to="/">Home</Link>

          {!userApp ? (
            <>
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="login-btn">
                Registrate
              </Link>
            </>
          ) : (
            <>



              <Link to="/vacunas">Vacunas</Link>
              <Link to="/mis-vacunas">Mis Vacunas</Link>
              <Link to="/grupos">Grupos</Link>
              <Link to="/perfiles">Perfiles</Link>


              <Link
                to="/mi-perfil"
                className="user-email"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #fff",
                  }}
                />

                <span style={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>
                  {userApp.username || userApp.email}
                </span>
              </Link>

              <Link to="/logout" className="btn-logout-nav">
                Salir
              </Link>


            </>
          )}
        </div>
      </div>
    </nav>
  );
}
