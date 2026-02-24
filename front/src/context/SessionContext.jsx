import { createContext, useState, useContext } from "react";

export const SessionContext = createContext();

export function useSession() {
  return useContext(SessionContext);
}

export function useUsuario() {
  const { userApp, setUserApp } = useContext(SessionContext);
  return { userApp, setUserApp };
}

export function useToken() {
  const { token } = useContext(SessionContext);
  return token;
}

export function useLogin() {
  const { onLogin } = useContext(SessionContext);
  return onLogin;
}

export function useLogout() {
  const { onLogout } = useContext(SessionContext);
  return onLogout;
}

export function usePerfilActivo() {
  const { perfilActivo } = useContext(SessionContext);
  return perfilActivo;
}

export function useSeleccionarPerfil() {
  const { seleccionarPerfil } = useContext(SessionContext);
  return seleccionarPerfil;
}

export function useLimpiarPerfil() {
  const { limpiarPerfil } = useContext(SessionContext);
  return limpiarPerfil;
}

export function SessionProvider({ children }) {
  const [userApp, setUserApp] = useState(
    () => JSON.parse(localStorage.getItem("session")) || null
  );

  const [token, setToken] = useState(
    () => JSON.parse(localStorage.getItem("token")) || null
  );


  const onLogin = (user) => {
    const payload = JSON.parse(atob(user.token.split(".")[1]));

    const userFixed = {
      _id: payload._id,
      email: payload.email,
      username: payload.username,
      token: user.token,
    };

    setUserApp(userFixed);
    setToken(user.token);

    localStorage.setItem("session", JSON.stringify(userFixed));
    localStorage.setItem("token", JSON.stringify(user.token));
  };

  const onLogout = () => {
    setUserApp(null);
    setToken(null);
    localStorage.removeItem("session");
    localStorage.removeItem("token");
  };


  const [perfilActivo, setPerfilActivo] = useState(
    JSON.parse(localStorage.getItem("perfilActivo")) || null
  );

  const seleccionarPerfil = (perfil) => {
    setPerfilActivo(perfil);
    localStorage.setItem("perfilActivo", JSON.stringify(perfil));
  };

  const limpiarPerfil = () => {
    setPerfilActivo(null);
    localStorage.removeItem("perfilActivo");
  };


  return (
    <SessionContext.Provider
      value={{ userApp, setUserApp, token, setToken, onLogin, onLogout, perfilActivo, seleccionarPerfil, limpiarPerfil }}
    >
      {children}
    </SessionContext.Provider>
  );
}