import { createContext, useState, useContext } from "react";

export const SessionContext = createContext();

// 👉 Devuelve TODO el contexto
export function useSession() {
  return useContext(SessionContext);
}

// 👉 Acceso directo a userApp y setUserApp
export function useUsuario() {
  const { userApp, setUserApp } = useContext(SessionContext);
  return { userApp, setUserApp };
}

// 👉 Acceso directo al token
export function useToken() {
  const { token } = useContext(SessionContext);
  return token;
}

// 👉 Acceso directo a onLogin
export function useLogin() {
  const { onLogin } = useContext(SessionContext);
  return onLogin;
}

// 👉 Acceso directo a onLogout
export function useLogout() {
  const { onLogout } = useContext(SessionContext);
  return onLogout;
}

export function SessionProvider({ children }) {
  const [userApp, setUserApp] = useState(
    () => JSON.parse(localStorage.getItem("session")) || null
  );

  const [token, setToken] = useState(
    () => JSON.parse(localStorage.getItem("token")) || null
  );

  // const onLogin = (user) => {
  //   setUserApp(user);
  //   setToken(user.token);

  //   localStorage.setItem("session", JSON.stringify(user));
  //   localStorage.setItem("token", JSON.stringify(user.token));
  // };

  const onLogin = (user) => {
    // decodificar el token
    const payload = JSON.parse(atob(user.token.split(".")[1]));

    const userFixed = {
      _id: payload._id,
      email: payload.email,
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

  return (
    <SessionContext.Provider
      value={{ userApp, setUserApp, token, setToken, onLogin, onLogout }}
    >
      {children}
    </SessionContext.Provider>
  );
}