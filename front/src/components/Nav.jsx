import { Link } from "react-router-dom";
import { useUsuario, useLogout } from "../context/SessionContext";

export default function Nav() {
  const { userApp } = useUsuario();
  const logout = useLogout();

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#06385f" }}>
      <div className="container d-flex justify-content-between align-items-center">

        {/* LOGO */}
        <div className="navbar-logo">
          <Link to="/">Mistomed</Link>
        </div>

        {/* MOBILE BTN */}
        <button
          className="navbar-toggler border-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
        >
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>

        {/* LINKS */}
        <div className="collapse navbar-collapse justify-content-end" id="navContent">
          <div className="navbar-links">
            {!userApp ? (
              <>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Registrate</Link>
              </>
            ) : (
              <>
                <span className="text-white fw-semibold me-3">
                  {userApp.email}
                </span>

                <Link to="/vacunas" className="me-2">Vacunas</Link>
                <Link to="/mis-vacunas" className="me-2">Mis Vacunas</Link>

                <button
                  onClick={logout}
                  className="btn btn-sm btn-light ms-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}