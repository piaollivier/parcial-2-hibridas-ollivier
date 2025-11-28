import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  let title = "¡Ups! Algo salió mal 😥";
  let message = "Ocurrió un error inesperado.";

if (isRouteErrorResponse(error)) {
  title = (
    <>
      {title}
      <br />
      Error {error.status}
    </>
  );

  message = (
    <>
      {message}
      <br />
      {error.statusText}
    </>
  );

  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="mt-5">
      <div className="login-page">
        <div className="login-card">
          <h1 className="login-title">{title}</h1>

          <p style={{ marginBottom: "20px", fontSize: "18px" }}>
            {message}
          </p>

          <button
            className="login-btn-form"
            onClick={() => (window.location.href = "/")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
