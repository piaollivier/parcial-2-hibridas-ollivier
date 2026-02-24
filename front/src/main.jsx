// front/src/main.jsx
import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ErrorBoundary from "./components/ErrorBoundary.jsx"
import App from "./App.jsx"
import Home from "./pages/Home.jsx"
import Layout from "./components/Layout.jsx"
import Login from "./pages/Login.jsx"
import Vacunas from "./pages/Vacunas.jsx"
import VacunasDetalle from "./pages/VacunasDetalle.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import { SessionContext, SessionProvider } from "./context/SessionContext.jsx"
import Logout from "./pages/Logout.jsx"
import MisVacunas from "./pages/MisVacunas.jsx"
import MisVacunasCrear from "./pages/MisVacunasCrear.jsx"
import MisVacunasEditar from "./pages/MisVacunasEditar.jsx"
import Register from "./pages/Register.jsx"
import MiPerfil from "./pages/MiPerfil.jsx"
import Grupos from "./pages/Grupos.jsx"
import GruposCrear from "./pages/GruposCrear.jsx"
import GruposEditar from "./pages/GruposEditar.jsx"
import Perfiles from "./pages/Perfiles";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/vacunas",
        element: <ProtectedRoute component={<Vacunas />} />,
      },
      {
        path: "/vacunas/:id",
        element: <ProtectedRoute component={<VacunasDetalle />} />,
      },
      { path: "/login", 
        element: <Login /> 
      },
      { path: "/logout", 
        element: <Logout /> 
      },
      {
        path: "/register",
        element: <Register />
      },
      { 
        path: "/mis-vacunas", 
        element: <MisVacunas /> 
      },       
      { 
        path: "/mis-vacunas/nueva", 
        element: <MisVacunasCrear /> 
      },
      { 
        path: "/mis-vacunas/editar/:id", 
        element: <MisVacunasEditar /> 
      },
      { 
        path: "/mi-perfil", 
        element: <MiPerfil /> 
      },
      {
        path: "/grupos",
        element: <ProtectedRoute component={<Grupos />} />,
      },
      {
        path: "/grupos/nuevo",
        element: <ProtectedRoute component={<GruposCrear />} />,
      },
      {
        path: "/grupos/editar/:id",
        element: <ProtectedRoute component={<GruposEditar />} />,
      },
      {
        path: "/perfiles",
        element: <ProtectedRoute component={<Perfiles />} />,
      }
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionProvider>
      <RouterProvider router={router} />
    </SessionProvider>
  </React.StrictMode>
)
